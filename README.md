# Rules of Shōbu
The rules can be found <a href='https://www.ultraboardgames.com/shobu/game-rules.php'>here</a>.

# How the Game Works

<ul>
  <li>Click <a href='https://brbavar.github.io/shobu/'>here</a> to play!</li>
  <li>For the time being, you can only play against someone sitting next to you. There are no CPU or online opponents.</li>
</ul>

# How to Play Offline
If you'd like to download the app to play offline, follow these instructions. 

<ol>
  <li><a href='https://nodejs.dev/learn/how-to-install-nodejs'>Install</a> a recent version of Node.js if you haven't yet.</li> 
  <li>Navigate to the directory where you want to store the Shōbu app.</li>
  <li>Run:
    <p></p>
    
```
npm install create-react-app
npx create-react-app shobu-loc
rm shobu-loc/src/*
git clone https://github.com/brbavar/shobu.git
mv shobu/src/* shobu-loc/src
rm -r shobu
cd shobu-loc/src
npm start
```

  </li>
  <li>If the app doesn't open automatically, visit <a href='http://localhost:3000'>this address</a> in your browser of choice.</li>
</ol>
