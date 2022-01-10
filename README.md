# How the Game Works

<ul>
  <li>The rules of Shōbu are quickly explained in <a href='https://www.youtube.com/watch?v=1qlwBgHXCyg&t=278s'>this video</a>. If you'd prefer to read about how the game is played, check out <a href='http://bronelgram.net/wp-content/uploads/2020/08/Regole-Shobu-2.pdf'>this PDF</a>.</li>
  <li>Once you understand the rules, <a href='https://brbavar.github.io/shobu/'>click</a> to start playing.</li>
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
