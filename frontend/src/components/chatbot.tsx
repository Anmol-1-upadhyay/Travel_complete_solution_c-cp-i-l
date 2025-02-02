import { useEffect, useRef, useState } from "react";
import useParamsStore from "../store/store";
import axios from "axios";
import WavEncoder from "wav-encoder";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import { FaComment, FaMicrophone, FaVolumeUp } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import { Box, Modal } from "@mui/material";
import ParameterDisplay from "./parameters";

interface Message {
  text: string;
  isUser: boolean;
  image?: string;
  audio?: boolean;
  speaking?: boolean;
  speakerId?: string; // Unique ID for the speaker
}

const ChatInterface = () => {
  // const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setOpenModal(true); // Open modal on click
    // setIsOpen(!isOpen);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(true); // Track visibility of suggestions
  const [suggestions] = useState([
    "hotels near taj mahal",
    "A luxurious resort for 3 people for 5 days",
    "Show me hotels with swimming pool in chennai",
  ]);
  // const [image, setImage] = useState<File | null>(null)
  const [isAudioInput, setIsAudioInput] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<
    number | null
  >(null); // Track which message is being spoken

  const { hotels, setHotels } = useParamsStore();
  const { parameters, setParameters } = useParamsStore();
  const [canSend, setcanSend] = useState(true);
  const [isfetching, setisfetching] = useState(false);

  const { dateRange, setDateRange } = useParamsStore();
  // const {rooms, setRooms} = useParamsStore();
  // const {adults, setAdults} = useParamsStore();
  // const {children, setChildren} = useParamsStore();
  const { cityName, setCityName } = useParamsStore();
  const { rooms, setRooms } = useParamsStore();
  const { adults, setAdults } = useParamsStore();
  const { children, setChildren } = useParamsStore();
  const { childrenAges, setChildrenAges } = useParamsStore();

  // Function to send the message and get the API response
  const handleSend = async () => {
    try {
      if (inputText.trim()) {
        setcanSend(false);
        // Add the user's message to the chat
        setMessages([...messages, { text: inputText, isUser: true }]);
        setInputText("");
        setSuggestionsVisible(false); // Hide suggestions once a message is sent

        // Send the input text to the API
        const response = await fetch("http://127.0.0.1:8000/chatbot", {
          // Update this URL with your API
          method: "POST", // Change the method to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }), // Send the input text in the request body
        });

        // Parse the response from the API
        const data = await response.json();
        console.log("data", data); // Log the API response

        // Check if the response contains combined_data and set hotels accordingly
        if (data.combined_data) {
          console.log("combined_data", data.combined_data); // Log the API response
          console.log("parameters", data.parameters); // Log the API response
          setHotels(data.combined_data);

          setDateRange({
            ...dateRange,
            from: data.parameters.CheckIn,
            to: data.parameters.CheckOut,
          });
          console.log("dateRange", dateRange);
          // setDateRange({ ...dateRange, to: data.parameters.CheckOut });
          setCityName(data.parameters.City);
          setRooms(data.parameters["PaxRooms"].length);
          data.parameters["PaxRooms"].forEach((room: any) => {
            setAdults(room.Adults);
            setChildren(room.Children);
            setChildrenAges(room.ChildrenAges);
          });

          setParameters(data.parameters);
        } else {
          console.log("No combined_data found in the response");
        }

        console.log("chatbot reponse", data.response); // Log the API response

        // Regex to extract JSON from the bot's response
        const regex = /json([\s\S]*?)/;
        // const match = data.response.match(regex);

        // let extractedParams = {};

        // if (match) {
        //   try {
        //     // Parse the extracted JSON part
        //     extractedParams = JSON.parse(match[1].trim());
        //     console.log("Extracted Params:", extractedParams);
        //   } catch (error) {
        //     console.error("Failed to parse JSON:", error);
        //   }
        // }

        const newMessage = {
          text: data.response.replace(regex, "").trim(),
          isUser: false,
          speakerId: "bot", // Bot message gets unique speaker ID
        };

        // Update the chat with the user's message and the API's response
        setMessages((prevMessages) => [
          ...prevMessages,
          // { text: inputText, isUser: true },
          // { text: data.response.replace(regex, "").trim(), isUser: false }, // Assuming API returns a 'message' field
          newMessage,
        ]);
        // console.log(messages);

        // Automatically speak the response if the input was audio
        if (isAudioInput) {
          speak(newMessage.text, newMessage);
        }

        setcanSend(true);
        setIsAudioInput(false);
      }
    } catch (error) {
      setcanSend(true);
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevents sending when Shift+Enter is used for new lines
      event.preventDefault(); // Prevents the default action of Enter (like new line)
      handleSend();
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedImage = e.target.files[0];
      const imageUrl = URL.createObjectURL(uploadedImage);
      setMessages([...messages, { text: "", isUser: true, image: imageUrl }]);
      setSuggestionsVisible(false); // Hide suggestions once a message is sent
    }
    if (e.target.files) {
      // const uploadedImage = e.target.files[0];
      // console.log("Uploaded image:", uploadedImage);
      setcanSend(false);

      const uploadedImage = e.target.files[0];
      const imageUrl = URL.createObjectURL(uploadedImage);
      setMessages([...messages, { text: "", isUser: true, image: imageUrl }]);
      setSuggestionsVisible(false); // Hide suggestions once a message is sent

      // setImage(uploadedImage);
      // console.log("image:",image);

      // Convert the uploaded file to a Blob (you can skip this step if you already have a Blob)
      const imageBlob = new Blob([uploadedImage], { type: uploadedImage.type });

      // Create FormData and append the file
      const formData = new FormData();
      // formData.append("city_code", getCityCode(cityName) || "");
      formData.append("images", imageBlob, "image.jpg");

      // Get the city_code (assuming getCityCode returns the correct value)
      // const cityCode = getCityCode(cityName) || "";

      // Log the FormData
      formData.forEach((value, key) => {
        console.log("here");
        console.log(key, value);
      });

      try {
        const response = await axios.post(
          "http://10.22.14.82:8000/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Send the input text to the API
        // const response = await fetch("http://127.0.0.1:8000/image", {
        //   // Update this URL with your API
        //   method: "POST", // Change the method to POST
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ code: getCityCode(cityName), image: uploadedImage }), // Send the input text in the request body
        // });

        console.log("Image uploaded successfully:", response.data);


        // Send the input text to the API
        const response2 = await fetch("http://127.0.0.1:8000/chatbot", {
          // Update this URL with your API
          method: "POST", // Change the method to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: response.data.descriptions[0] }), // Send the input text in the request body
        });

        const data = await response2.json();


        const newMessage = {
          text: data.response,
          isUser: false,
          speakerId: "bot", // Bot message gets unique speaker ID
        };

        // Update the chat with the user's message and the API's response
        setMessages((prevMessages) => [
          ...prevMessages,
          // { text: inputText, isUser: true },
          // { text: data.response.replace(regex, "").trim(), isUser: false }, // Assuming API returns a 'message' field
          newMessage,
        ]);

        alert("Image uploaded successfully!");
        setcanSend(true);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
        setcanSend(true);
      }
    }
  };

  // Trigger the file input click when the file icon is clicked
  const handleFileIconClick = () => {
    document.getElementById("imageInput2")?.click();
  };

  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const audioStream = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.current = stream;
      audioContext.current = new AudioContext({ sampleRate: 16000 }); // Set the sample rate to 16kHz

      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const rawBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        audioChunks.current = [];
        const wavBlob = await convertToWav(rawBlob);
        createDownloadLink(wavBlob);

        // Call the uploadAudio function to send the audio to the backend
        await uploadAudio(wavBlob);
      };

      recorder.start();
      setIsRecording(true);
      setIsAudioInput(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    audioStream.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const convertToWav = async (blob: Blob): Promise<Blob> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get the audio data from the first channel (mono)
    const channelData = audioBuffer.getChannelData(0); // Float32Array
    const sampleRate = 16000;
    const sampleCount = channelData.length;
    const wavBuffer = new ArrayBuffer(44 + sampleCount * 2); // WAV header + 16-bit PCM data
    const view = new DataView(wavBuffer);

    // Write WAV Header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF"); // ChunkID
    view.setUint32(4, 36 + sampleCount * 2, true); // ChunkSize
    writeString(8, "WAVE"); // Format
    writeString(12, "fmt "); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size (PCM)
    view.setUint16(20, 1, true); // AudioFormat (PCM = 1)
    view.setUint16(22, 1, true); // NumChannels (Mono = 1)
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample / 8)
    view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample / 8)
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(36, "data"); // Subchunk2ID
    view.setUint32(40, sampleCount * 2, true); // Subchunk2Size

    // Write PCM Data
    let offset = 44;
    for (let i = 0; i < sampleCount; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i])); // Clamp to [-1.0, 1.0]
      view.setInt16(offset, sample * 0x7fff, true); // Convert to 16-bit PCM
      offset += 2;
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const createDownloadLink = (wavBlob: Blob) => {
    const url = URL.createObjectURL(wavBlob);
    setDownloadUrl(url);
  };

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      setcanSend(false);
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav"); // Append the audio file to the form data
      formData.append(
        "metadata",
        JSON.stringify({ description: "Audio file upload" })
      ); // Optional metadata
      // Log the FormData
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/voice",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("response audio", response.data); // Log the API response


      if (response.status === 200) {
        console.log("Audio uploaded successfully:", response.data);
        // Update the chat with the user's message and the API's response


        // Check if the response contains combined_data and set hotels accordingly
        if (response.data["chatbot_response"]["combined_data"]) {
          console.log("combined_data", response.data["chatbot_response"]["combined_data"]); // Log the API response
          console.log("parameters", response.data["chatbot_response"]["parameters"]); // Log the API response
          setHotels(response.data["chatbot_response"]["combined_data"]);

          setDateRange({
            ...dateRange,
            from: response.data["chatbot_response"]["parameters"].CheckIn,
            to: response.data["chatbot_response"]["parameters"].CheckOut,
          });
          console.log("dateRange", dateRange);
          // setDateRange({ ...dateRange, to: data.parameters.CheckOut });
          setCityName(response.data["chatbot_response"]["parameters"].City);
          setRooms(response.data["chatbot_response"]["parameters"]["PaxRooms"].length);
          response.data["chatbot_response"]["parameters"]["PaxRooms"].forEach((room: any) => {
            setAdults(room.Adults);
            setChildren(room.Children);
            setChildrenAges(room.ChildrenAges);
          });

          setParameters(response.data["chatbot_response"]["parameters"]);
        } else {
          console.log("No combined_data found in the response");
        }

        const userMessage = {
          text: response.data["transcription"],
          isUser: true,
          audio: true,
          speaking: false,
        };
        const botMessage = {
          text: response.data["chatbot_response"]["response"],
          isUser: false,
          speaking: isSpeaking,
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          // { text: response.data["transcription"], isUser: true },
          userMessage,
          // { text: response.data["chatbot_response"], isUser: false }, // Assuming API returns a 'message' field
          botMessage,
        ]);
        setInputText("");
        setSuggestionsVisible(false); // Hide suggestions once a message is sent

        setcanSend(true);
        // Automatically speak the response
        speak(botMessage.text, botMessage);
      } else {
        console.error("Failed to upload audio:", response.statusText);
        setcanSend(true);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      setcanSend(true);
    }
  };

  let currentUtterance: SpeechSynthesisUtterance | null = null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingMsg, setIsSpeakingMsg] = useState();

  // const speak = (text: string) => {
  //   if (window.speechSynthesis.speaking) {
  //     window.speechSynthesis.cancel();
  //     if (currentUtterance && currentUtterance.text === text) {
  //       currentUtterance = null;
  //       return;
  //     }
  //   }

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   currentUtterance = utterance;

  //   utterance.onend = () => {
  //     currentUtterance = null;
  //   };

  //   window.speechSynthesis.speak(utterance);
  // };

  // Function to toggle the 'speaking' state of a message
  const toggleSpeakingState = (index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].speaking = !updatedMessages[index].speaking;
    setMessages(updatedMessages);
  };

  const speak = (text: string, msg: Message) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      //Update the message's speaking state
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.speakerId === msg.speakerId ? { ...m, speaking: false } : m
        )
      );
      setSpeakingMessageIndex(null); // Reset speaking message index
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      // Update the message's speaking state when speech starts
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.speakerId === msg.speakerId ? { ...m, speaking: true } : m
        )
      );
      setSpeakingMessageIndex(
        messages.findIndex((m) => m.speakerId === msg.speakerId)
      );
    };

    utterance.onend = () => {
      // Update the message's speaking state when speech ends
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.speakerId === msg.speakerId ? { ...m, speaking: false } : m
        )
      );
      setSpeakingMessageIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Runs when 'messages' changes

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4 rounded-lg shadow-lg bg-black/70">
        <div className="text-2xl font-bold text-white mb-4 justify-center flex">
          <div>
            <span className="text-[#2a7de1]">Trav</span>
            <span className="text-[#f26b25]">Bot</span>
          </div>
        </div>
        <div className="flex flex-col h-[550px]">
          <div
            className="flex-1 overflow-y-auto mb-4 space-y-4"
            ref={chatContainerRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? "bg-[#2a7de1] text-white border border-gray-950 p-4"
                      : "bg-gray-700 text-white border border-gray-500 p-4"
                  } flex flex-col text-xs`}
                >
                  {msg.text}
                  {/* Show the image if it exists */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="mt-2 rounded-lg max-w-full h-auto"
                    />
                  )}
                  {!msg.isUser && (
                    <div>
                      <button
                        onClick={() => speak(msg.text, msg)}
                        className={`mt-auto p-1 ${
                          isSpeaking ? "bg-black" : "bg-black"
                        } rounded-full`}
                      >
                        {/* <AnimatedSpeakerIcon isAnimating={isSpeaking} /> */}
                        {/* <SpeakerIcon /> */}
                        {/* <ChatbotIcon key={index} isAnimating={isSpeaking}/> */}
                        {msg.speaking ? (
                          <img
                            src="https://static.showit.co/file/ytUzyeHcTVKKYyHPvUZMkw/211964/giphy.gif"
                            alt=""
                            className="w-5 h-5"
                          />
                        ) : (
                          <SpeakerIcon />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions (will hide after chat starts) */}
          {suggestionsVisible && (
            <div className="space-y-2 mb-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-[#323131]/50 text-white p-4 rounded-lg cursor-pointer hover:bg-black"
                  onClick={() => {
                    setInputText(suggestion);
                    //   setSuggestionsVisible(false) // Hide suggestions when a suggestion is clicked
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {!canSend && <DotsLoader />}

          <div className="flex flex-wrap gap-2 bg-black p-2 rounded-lg items-center">
            <img
              src={"./chatbot.gif"}
              alt=""
              className="mt-2 rounded-lg max-w-11 h-auto bg-black"
            />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type here.."
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none"
            />
            {/* <button 
            onClick={() => document.getElementById('fileInput')?.click()}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <FileIcon />
          </button> */}
            {/* Hidden file input */}
            <input
              type="file"
              id="imageInput2"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="group relative">
              <button
                onClick={handleFileIconClick}
                className="p-2 hover:bg-gray-700 rounded"
                disabled={!canSend}
              >
                <FileIcon />
              </button>
              <span className="absolute left-1/2 -bottom-20 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10">
                Send Image to Chatbot
              </span>
            </div>

            <div className="group relative">
              <button
                className="p-2 hover:bg-gray-700 rounded"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!canSend}
              >
                {/* <MicIcon /> */}
                {isRecording ? (
                  // <SpeakingIcon /> // Speaking icon
                  // <CIcon icon={cisMediaRecordCircle} />
                  <GraphicEqRoundedIcon className="text-cyan-50" />
                ) : (
                  <MicIcon /> // Mic icon
                )}
              </button>
              <span className="absolute left-1/2 -bottom-12 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10">
                {isRecording ? "Stop recording" : "Talk to Chatbot"}
              </span>
            </div>

            {/* {downloadUrl && (
            <a
              href={downloadUrl}
              download="recording.wav"
              className="px-4 py-2 bg-blue-500 rounded text-white"
            >
              Download Recording
            </a>
          )} */}

            <div className="group relative">
              <button
                onClick={handleSend}
                className={`p-2 hover:bg-gray-700 rounded ${
                  canSend ? "bg-blue-500" : "bg-gray-400"
                } `}
                disabled={!canSend}
              >
                <SendIcon />
              </button>
              <span className="absolute left-1/2 -bottom-12 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10">
                {canSend ? "Send Message" : "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-center bg-gray-200">
      </div> */}

      <ParameterDisplay parameters={parameters} />

    </div>

    // <div>
    //   {/* Floating Button */}

    //     <button
    //       onClick={toggleChat}
    //       className="fixed bottom-10 right-10 p-4 bg-blue-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
    //     >
    //       <FaComment size={24} />
    //     </button>

    //   {/* {isOpen && (

    //   )} */}

    //   <Modal
    //     open={openModal}
    //     onClose={handleCloseModal}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box
    //       className="modal-content w-[85] max-w-4xl p-6 h-full bg-black rounded-lg shadow-lg flex font-mono overflow-hidden"
    //       sx={{
    //         position: "absolute",
    //         top: "50%",
    //         left: "80%",
    //         right: "-15%",
    //         transform: "translate(-50%, -50%)",
    //         overflowY: "auto",
    //         maxHeight: "95%",
    //       }}
    //     >

    //     </Box>
    //   </Modal>
    // </div>
  );
};

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
    />
  </svg>
);

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

// const SpeakingIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6 text-white"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 3v6m0 6v6m5-9a5 5 0 00-5-5m0 0a5 5 0 015 5m-5 5a5 5 0 01-5-5m5 5a5 5 0 005-5"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M16.5 12c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5S10.57 8.5 12.5 8.5s3.5 1.57 3.5 3.5z"
//     />
//   </svg>
// );

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
      clipRule="evenodd"
    />
  </svg>
);

const DotsLoader: React.FC = () => {
  return (
    <div className="flex space-x-2 justify-center">
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
    </div>
  );
};

export default ChatInterface;
