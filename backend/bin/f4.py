# import os
# from fastapi import APIRouter
# import torch
# import numpy as np
# import faiss
# import pickle
# import warnings
# import tkinter as tk
# from tkinter import ttk
# from PIL import Image, ImageTk
# from torchvision import models, transforms
# from sklearn.decomposition import PCA
# from torch.utils.data import DataLoader, Dataset

# imagesearch_router = APIRouter()

# warnings.filterwarnings("ignore")

# device = "cuda" if torch.cuda.is_available() else "cpu"

# class ImageFeatureExtractor:
#     def __init__(self):
#         self.model = models.efficientnet_b2(pretrained=True).to(device)
#         self.model.eval()
#         self.transform = transforms.Compose([
#             transforms.Resize((256, 256)),
#             transforms.ToTensor(),
#             transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
#         ])
    
#     def extract_features(self, dataloader):
#         embeddings = []
#         with torch.no_grad():
#             for batch in dataloader:
#                 batch = batch.to(device)
#                 features = self.model(batch)
#                 embeddings.append(features.cpu().numpy())
#         return np.vstack(embeddings)
    
#     def transform_image(self, image):
#         return self.transform(image).unsqueeze(0).to(device)

# class ImageDataset(Dataset):
#     def __init__(self, image_paths, transform):
#         self.image_paths = image_paths
#         self.transform = transform

#     def __len__(self):
#         return len(self.image_paths)

#     def __getitem__(self, idx):
#         image = Image.open(self.image_paths[idx]).convert("RGB")
#         return self.transform(image)

# class ImageSearchEngine:
#     def __init__(self, hotels_dir):
#         self.hotels_dir = hotels_dir
#         self.extractor = ImageFeatureExtractor()
#         self.image_paths = self._load_image_paths()
#         self.embeddings = None
#         self.pca = None
#         self.index = None
    
#     def _load_image_paths(self):
#         return [os.path.join(dp, f) for dp, dn, filenames in os.walk(self.hotels_dir) for f in filenames if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
#     def process_images(self):
#         dataset = ImageDataset(self.image_paths, self.extractor.transform)
#         dataloader = DataLoader(dataset, batch_size=64, shuffle=False)
#         embeddings = self.extractor.extract_features(dataloader)
#         self.embeddings, self.pca = self.apply_pca(embeddings)
#         self.index = self.build_faiss_index(self.embeddings)
#         self.save_data()
    
#     def apply_pca(self, embeddings, explained_variance=0.95):
#         pca = PCA(n_components=explained_variance)
#         reduced_embeddings = pca.fit_transform(embeddings)
#         return reduced_embeddings, pca
    
#     def build_faiss_index(self, embeddings):
#         embeddings = np.ascontiguousarray(embeddings, dtype="float32")
#         faiss.normalize_L2(embeddings)
#         index = faiss.IndexFlatIP(embeddings.shape[1])
#         index.add(embeddings)
#         return index
    
#     def save_data(self):
#         np.save("embeddings.npy", self.embeddings)
#         np.save("image_paths.npy", np.array(self.image_paths))
#         with open("pca.pkl", "wb") as f:
#             pickle.dump(self.pca, f)
    
#     def load_data(self):
#         self.embeddings = np.load("embeddings.npy")
#         self.image_paths = np.load("image_paths.npy", allow_pickle=True)
#         with open("pca.pkl", "rb") as f:
#             self.pca = pickle.load(f)
#         self.index = self.build_faiss_index(self.embeddings)
    
#     def search_similar_images(self, query_image_path):
#         query_image = Image.open(query_image_path).convert("RGB")
#         query_tensor = self.extractor.transform_image(query_image)
#         with torch.no_grad():
#             query_features = self.extractor.model(query_tensor).cpu().numpy()
#         query_features = self.pca.transform(query_features)
#         query_features = np.ascontiguousarray(query_features, dtype="float32")
#         faiss.normalize_L2(query_features)
#         distances, indices = self.index.search(query_features, len(self.image_paths))
#         hotel_results = {}
#         for i, idx in enumerate(indices[0]):
#             if distances[0][i] > 0.25:
#                 hotel_name = os.path.basename(os.path.dirname(self.image_paths[idx]))
#                 if hotel_name not in hotel_results or distances[0][i] > hotel_results[hotel_name]["similarity"]:
#                     hotel_results[hotel_name] = {"image_path": self.image_paths[idx], "similarity": distances[0][i]}
#         return hotel_results

# def display_results(results):
#     root = tk.Tk()
#     root.title("Hotel Image Search Results")
#     frame = ttk.Frame(root)
#     frame.pack(fill=tk.BOTH, expand=True)
#     canvas = tk.Canvas(frame)
#     scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
#     scroll_frame = ttk.Frame(canvas)
    
#     scroll_frame.bind(
#         "<Configure>",
#         lambda e: canvas.configure(
#             scrollregion=canvas.bbox("all")
#         )
#     )
#     canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
#     canvas.configure(yscrollcommand=scrollbar.set)
    
#     for hotel, data in results.items():
#         img = Image.open(data["image_path"]).resize((200, 150))
#         img = ImageTk.PhotoImage(img)
#         label = ttk.Label(scroll_frame, image=img, text=f"{hotel} - Similarity: {data['similarity']:.2f}", compound="top")
#         label.image = img
#         label.pack()
    
#     canvas.pack(side="left", fill="both", expand=True)
#     scrollbar.pack(side="right", fill="y")
#     root.mainloop()


# # Helper function to convert numpy types
# def convert_numpy_types(value):
#     if isinstance(value, np.generic):  # Check if value is a numpy type
#         return value.item()  # Convert to native Python type (e.g., np.str_ -> str, np.float32 -> float)
#     return value

# # API Endpoints
# @imagesearch_router.post("/")
# async def searching_similar_images(hotel_code: str):
#     # hotels_folder = f"./{hotel_code}"  # Dynamic folder path based on the hotel code
#     # search_engine = ImageSearchEngine(hotels_folder)
#     # search_engine.load_data()  # Load pre-processed data (embeddings, PCA, FAISS index)
    
#     # # Assume the query image path is fixed and already available in backend
#     # query_image_path = "input_images/query_image.jpg"  # Path to the pre-existing image

#     # # Get search results
#     # results = search_engine.search_similar_images(query_image_path)
    
#     # return {"results": results}


#     hotels_folder = f"./{hotel_code}"
#     test_folder = "tests"
    
#     search_engine = ImageSearchEngine(hotels_folder)
#     search_engine.process_images()
#     search_engine.load_data()
    
#     test_images = [os.path.join(test_folder, f) for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
#     # for query_image in test_images:
#     #     print(f"Query Image: {query_image}")
#     #     results = search_engine.search_similar_images(query_image)
#     #     display_results(results)

#     # query_image="E:/tbo_hackathon/backend/tests/127343_1.jpg"
#     query_image = f"./tests/{hotel_code}_1.jpg"
#     print(f"Query Image: {query_image}")
#     results = search_engine.search_similar_images(query_image)
#     display_results(results)
#     print("resulst:",results)

#     # Convert numpy types to native Python types for all image paths and similarity scores
#     converted_results = {
#         key: {
#             'image_path': convert_numpy_types(value['image_path']),
#             'similarity': convert_numpy_types(value['similarity'])
#         }
#         for key, value in results.items()
#     }


#     return {"results": converted_results}
    



# if __name__ == "__main__":
#     hotels_folder = "140143"
#     test_folder = "tests"
    
#     search_engine = ImageSearchEngine(hotels_folder)
#     search_engine.process_images()
#     search_engine.load_data()
    
#     test_images = [os.path.join(test_folder, f) for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
#     for query_image in test_images:
#         print(f"Query Image: {query_image}")
#         results = search_engine.search_similar_images(query_image)
#         display_results(results)
