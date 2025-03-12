// import { auth, GoogleProvider } from "../config/firebase";
// import { useState } from "react"; 
// import { createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth';

// export const Auth = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const signIn = async () => {
//         try{ 
//             await createUserWithEmailAndPassword(auth, email, password);
//         }catch(err){
//             console.log(err);
//         }
//     };

//     const signInWithGoogle = async () => {
//         try{
//             await signInWithPopup(auth, GoogleProvider);
//         }catch(err){
//             console.log(err);
//         }
//     };


//     return <div>
//         <input placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
//         <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}/>
//         <button onClick={signIn}>Sign In</button>

//         <button onClick={signInWithGoogle}> Sign-in with Google </button>
//     </div>
// };

// //26
