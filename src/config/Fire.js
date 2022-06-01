import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCBd9yYSIcn_Plkzu1ka3JXZfzJ-6uTPts",
  authDomain: "expense-tracker-43cdf.firebaseapp.com",
  projectId: "expense-tracker-43cdf",
  storageBucket: "expense-tracker-43cdf.appspot.com",
  messagingSenderId: "802172552815",
  appId: "1:802172552815:web:338f1ca32105c111a5af9a"
};

const fire = firebase.initializeApp(config);
export default fire;
