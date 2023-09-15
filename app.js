// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, push, serverTimestamp, onChildAdded } from 'firebase/database';

// Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyCsofmHs8XK5HvHrx499KnJHc3DTPgjEiY",
    authDomain: "web-based-chat-6b794.firebaseapp.com",
    databaseURL: "https://web-based-chat-6b794-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "web-based-chat-6b794",
    storageBucket: "web-based-chat-6b794.appspot.com",
    messagingSenderId: "46036724193",
    appId: "1:46036724193:web:06af5ad021973e96630aa0",
    measurementId: "G-GX9PFGFG1Y"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Get references to HTML elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const logoutButton = document.getElementById('logout-button');

// Function to display a new message in the chat
function displayMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message.text;
    const timestamp = new Date(message.timestamp).toLocaleString();
    messageElement.innerHTML += `<br><span class="timestamp">${timestamp}</span>`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listener for sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        const messagesRef = ref(db, 'messages');
        const timestamp = serverTimestamp();

        // Push a new message to the database
        push(messagesRef, {
            text: message,
            timestamp: timestamp
        });

        messageInput.value = '';
    }
});

// Event listener for logging out
logoutButton.addEventListener('click', () => {
    signOut(firebaseApp.auth())
        .then(() => {
            // User signed out successfully
            // You can redirect or perform other actions here
        })
        .catch((error) => {
            // Handle logout errors
            console.error('Logout failed:', error);
        });
});

// Event listener for listening to and displaying incoming messages from Firebase
const messagesRef = ref(db, 'messages');
onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
});

// Authentication state observer
onAuthStateChanged(firebaseApp.auth(), (user) => {
    if (user) {
        // User is signed in
        console.log(`User is signed in with ID: ${user.uid}`);
        // You can perform actions for authenticated users here.
    } else {
        // User is signed out
        console.log('User is signed out');
        // You can perform actions for signed-out users here.
    }
});
