// const admin = require("firebase-admin");
// const db = admin.firestore();

// const initializeSocket = (io) => {
//   io.on("connection", (socket) => {
//     socket.on("join-document", async ({ docId }) => {
//       socket.join(docId);
//       const docRef = db.collection("documents").doc(docId);
//       const doc = await docRef.get();
//       if (doc.exists) {
//         socket.emit("load-document", doc.data().content);
//       }
//     });

//     socket.on("send-changes", ({ docId, content }) => {
//       socket.to(docId).emit("receive-changes", content);
//       db.collection("documents").doc(docId).set({ content });
//     });
//   });
// };

// module.exports = { initializeSocket };


//FOR NOW USING THIS:

// const admin = require("firebase-admin");
// const db = admin.firestore();

// // In-memory object to store document content (just for now, replace it with Firestore later)
// const documents = {};

// const initializeSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("User connected");

//     // Join the document's room when a user connects
//     socket.on("join-document", ({ docId }) => {
//       socket.join(docId);
//       console.log(`User joined document: ${docId}`);

//       // Load the document content from the in-memory object
//       if (documents[docId]) {
//         socket.emit("load-document", documents[docId]);
//       }
//     });

//     // Handle changes sent from clients and broadcast it to others
//     socket.on("send-changes", ({ docId, content }) => {
//       documents[docId] = content; // Store content in-memory (temporary storage)
//       socket.to(docId).emit("receive-changes", content);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
// };

// module.exports = { initializeSocket };



//NO FIREBASE CODE:

// In-memory object to store document content (just for now, replace it with a persistent database later)
// const documents = {};

// const initializeSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("User connected");

//     // Join the document's room when a user connects
//     socket.on("join-document", ({ docId }) => {
//       socket.join(docId);
//       console.log(`User joined document: ${docId}`);

//       // Load the document content from the in-memory object
//       if (documents[docId]) {
//         socket.emit("load-document", documents[docId]);
//       }
//     });

//     // Handle changes sent from clients and broadcast it to others
//     socket.on("send-changes", ({ docId, content }) => {
//       documents[docId] = content; // Store content in-memory (temporary storage)
//       socket.to(docId).emit("receive-changes", content);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
// };

// module.exports = { initializeSocket };


// socketController.js

const documents = {};  // Store documents in-memory

// Initialize Socket.io
const initializeSocket = (io) => {
  io.on('connection', socket => {
    console.log('A user connected');

    // When a user requests a document
    socket.on('get-document', documentId => {
      // Join the document's room
      socket.join(documentId);

      // Create the document if it doesn't exist yet
      if (!documents[documentId]) {
        documents[documentId] = {
          content: { ops: [{ insert: 'Start typing here...\n' }] },
          title: 'Untitled Document'
        };
      }

      // Send the document to the client
      socket.emit('load-document', documents[documentId]);

      // Handle changes from the client
      socket.on('send-changes', delta => {
        // Broadcast the changes to other clients in the same room
        socket.to(documentId).emit('receive-changes', delta);
      });

      // Save the document changes when the client sends them
      socket.on('save-document', document => {
        documents[documentId] = document;  // Update the document in memory
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

module.exports = { initializeSocket };
