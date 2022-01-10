# Setup
<a href='https://nodejs.dev/learn/how-to-install-nodejs'>Install</a> a recent version of Node.js if you haven't yet. Then navigate to the directory where you want to store the Shōbu app and run: 
```
npm install create-react-app
npx create-react-app shobu
rm shobu/src/*
git clone https://github.com/brbavar/shobu-src.git
mv shobu-src/* shobu/src
rm -r shobu-src
cd shobu/src
npm start
```
Finally, if it doesn't happen automatically, simply open `http://localhost:3000` in your browser of choice.

# Rules of Shōbu
The rules can be found <a href='https://www.ultraboardgames.com/shobu/game-rules.php'>here</a>.
