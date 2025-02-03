import os
from fastapi import APIRouter
import torch
import numpy as np
import faiss
import pickle
import warnings
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
from torchvision import models, transforms
from sklearn.decomposition import PCA
from torch.utils.data import DataLoader, Dataset

imagesearch_router = APIRouter()

warnings.filterwarnings("ignore")

device = "cuda" if torch.cuda.is_available() else "cpu"

class ImageFeatureExtractor:
    def __init__(self):
        self.model = models.efficientnet_b7(pretrained=True).to(device)
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def extract_features(self, dataloader):
        embeddings = []
        with torch.no_grad():
            for batch in dataloader:
                batch = batch.to(device)
                features = self.model(batch).cpu().numpy()
                embeddings.append(features)
        return np.vstack(embeddings)
    
    def transform_image(self, image):
        return self.transform(image).unsqueeze(0).to(device)

class ImageDataset(Dataset):
    def __init__(self, image_paths, transform):
        self.image_paths = image_paths
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image = Image.open(self.image_paths[idx]).convert("RGB")
        return self.transform(image)

class ImageSearchEngine:
    def __init__(self, hotels_dir):
        self.hotels_dir = hotels_dir
        self.extractor = ImageFeatureExtractor()
        self.image_paths = self._load_image_paths()
        self.embeddings = None
        self.pca = None
        self.index = None
    
    def _load_image_paths(self):
        return [os.path.join(dp, f) for dp, dn, filenames in os.walk(self.hotels_dir) for f in filenames if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    def process_images(self):
        dataset = ImageDataset(self.image_paths, self.extractor.transform)
        dataloader = DataLoader(dataset, batch_size=64, shuffle=False)
        embeddings = self.extractor.extract_features(dataloader)
        self.embeddings, self.pca = self.apply_pca(embeddings)
        self.index = self.build_faiss_index(self.embeddings)
        self.save_data()
    
    def apply_pca(self, embeddings, explained_variance=0.95):
        pca = PCA(n_components=explained_variance)
        reduced_embeddings = pca.fit_transform(embeddings)
        return reduced_embeddings, pca
    
    def build_faiss_index(self, embeddings):
        embeddings = np.ascontiguousarray(embeddings, dtype="float32")
        faiss.normalize_L2(embeddings)
        d = embeddings.shape[1]
        index = faiss.IndexHNSWFlat(d, 32)  # HNSW index with 32 neighbors
        index.hnsw.efConstruction = 200  # High efConstruction for better quality
        index.hnsw.efSearch = 50  # Balances accuracy and speed
        index.add(embeddings)
        return index
    
    def save_data(self):
        np.save("embeddings.npy", self.embeddings)
        np.save("image_paths.npy", np.array(self.image_paths))
        with open("pca.pkl", "wb") as f:
            pickle.dump(self.pca, f)
    
    def load_data(self):
        self.embeddings = np.load("embeddings.npy")
        self.image_paths = np.load("image_paths.npy", allow_pickle=True)
        with open("pca.pkl", "rb") as f:
            self.pca = pickle.load(f)
        self.index = self.build_faiss_index(self.embeddings)
    
    def search_similar_images(self, query_image_paths, k_neighbors=10):
        hotel_scores = {}
        
        for query_image_path in query_image_paths:
            query_image = Image.open(query_image_path).convert("RGB")
            query_tensor = self.extractor.transform_image(query_image)
            
            with torch.no_grad():
                query_features = self.extractor.model(query_tensor).cpu().numpy()
            
            query_features = self.pca.transform(query_features)
            query_features = np.ascontiguousarray(query_features, dtype="float32")
            faiss.normalize_L2(query_features)
            
            distances, indices = self.index.search(query_features, k_neighbors)  # Return top k results

            image_scores = {}
            for i, idx in enumerate(indices[0]):
                hotel_name = os.path.basename(os.path.dirname(self.image_paths[idx]))
                image_scores[hotel_name] = max(image_scores.get(hotel_name, 0), distances[0][i])

            for hotel, score in image_scores.items():
                if hotel not in hotel_scores:
                    hotel_scores[hotel] = []
                hotel_scores[hotel].append(score)

        final_scores = {
            hotel: np.mean(scores) for hotel, scores in hotel_scores.items() 
        }
        sorted_scores = dict(sorted(final_scores.items(), key=lambda item: item[1], reverse=True))
        return sorted_scores

# For Test purpose only
def display_results(results):
    root = tk.Tk()
    root.title("Hotel Image Search Results")

    # Create main frame
    frame = ttk.Frame(root)
    frame.pack(fill=tk.BOTH, expand=True)

    # Create a canvas for both horizontal and vertical scrolling
    canvas = tk.Canvas(frame)
    v_scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
    h_scrollbar = ttk.Scrollbar(frame, orient="horizontal", command=canvas.xview)
    scroll_frame = ttk.Frame(canvas)

    # Bind scrolling
    scroll_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )
    canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
    canvas.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)

    # Populate the results
    for hotel, data in results.items():
        hotel_frame = ttk.Frame(scroll_frame)
        
        # Hotel name and score
        hotel_label = ttk.Label(hotel_frame, text=f"{hotel} - Score: {data['score']:.2f}", font=("Arial", 14, "bold"))
        hotel_label.pack(side="top", anchor="w", padx=10, pady=5)

        # Horizontal container for images
        image_frame = ttk.Frame(hotel_frame)
        for img_path in data["image_paths"]:
            img = Image.open(img_path).resize((150, 100))
            img = ImageTk.PhotoImage(img)
            img_label = ttk.Label(image_frame, image=img)
            img_label.image = img  # Keep reference to avoid garbage collection
            img_label.pack(side="left", padx=5, pady=5)
        
        image_frame.pack(side="top", anchor="w")
        hotel_frame.pack(fill="x", padx=10, pady=10)

    # Pack the canvas and scrollbars
    canvas.pack(side="left", fill="both", expand=True)
    v_scrollbar.pack(side="right", fill="y")
    h_scrollbar.pack(side="bottom", fill="x")

    root.mainloop()



# Helper function to convert numpy types
def convert_numpy_types(value):
    if isinstance(value, np.generic):  # Check if value is a numpy type
        return value.item()  # Convert to native Python type (e.g., np.str_ -> str, np.float32 -> float)
    return value

# API Endpoints
@imagesearch_router.post("/")
async def searching_similar_images(hotel_code: str):
    hotels_folder = f"./{hotel_code}"
    test_folder = "tests"
    
    search_engine = ImageSearchEngine(hotels_folder)
    search_engine.process_images()
    search_engine.load_data()
    
    test_images = [os.path.join(test_folder, f) for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # results = search_engine.search_similar_images(test_images)
    # print(len(results))
    # print(results)

    # for query_image in test_images:
    #     print(f"Query Image: {query_image}")
    #     results = search_engine.search_similar_images(query_image)
    #     display_results(results)

    # query_image="E:/tbo_hackathon/backend/tests/127343_1.jpg"
    # query_image = f"./tests/{hotel_code}_1.jpg"
    # print(f"Query Image: {query_image}")
    # test_images = [os.path.join(test_folder, f) for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # results = search_engine.search_similar_images(query_image)
    results = search_engine.search_similar_images(test_images)
    # display_results(results)
    print(len(results))
    print("resulst:",results)

    # Convert numpy types to native Python types for all image paths and similarity scores
    # converted_results = {
    #     key: {
    #         'image_path': convert_numpy_types(value['image_path']),
    #         'similarity': convert_numpy_types(value['similarity'])
    #     }
    #     for key, value in results.items()
    # }

    # Convert all numpy float values to Python float
    converted_results = {key: float(value) for key, value in results.items()}

    results_fixed = {
        hotel: {
            "score": float(score), 
            "image_paths": [
                os.path.join(hotels_folder, hotel, img) 
                for img in os.listdir(os.path.join(hotels_folder, hotel)) 
                if img.lower().endswith(('.png', '.jpg', '.jpeg'))
            ]
        }
        for hotel, score in results.items()
    }

    # print("resulst", results_fixed)
    # display_results(results_fixed)

    return {"results": converted_results}
    

if __name__ == "__main__":
    hotels_folder = "138673"
    test_folder = "test"
    
    search_engine = ImageSearchEngine(hotels_folder)
    search_engine.process_images()
    search_engine.load_data()
    
    test_images = [os.path.join(test_folder, f) for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    results = search_engine.search_similar_images(test_images)
    print(len(results))
    print(results)

    results_fixed = {
        hotel: {
            "score": float(score), 
            "image_paths": [
                os.path.join(hotels_folder, hotel, img) 
                for img in os.listdir(os.path.join(hotels_folder, hotel)) 
                if img.lower().endswith(('.png', '.jpg', '.jpeg'))
            ]
        }
        for hotel, score in results.items()
    }

    display_results(results_fixed)
