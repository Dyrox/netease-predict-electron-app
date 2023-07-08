var playlistHeat; 
var playlistTrackCount; 
var playlistContributingFactor;
var songRank;

function getPlaylistInfo() {
  const playlistLink = document.getElementById("playlistLink").value;
  const playlistID = getPlaylistID(playlistLink);

  // Display the loading indicator
  document.getElementById("loadingIndicator").style.display = "block";

  // Send GET request to the API to get playlist information
  const apiUrl = "https://netease-cloud-music-api-umber-six-57.vercel.app/playlist/detail?id=" + playlistID;
  
  $.get(apiUrl, function(data) {
    const playlistInfo = data.playlist;

    // Display playlist information on the page
    document.getElementById("playlistCover").src = playlistInfo.coverImgUrl;
    document.getElementById("playlistTitle").textContent = playlistInfo.name;
    document.getElementById("playlistPlayCount").textContent = "播放数：" + playlistInfo.playCount;
    console.log("这里一共播放量：" + playlistInfo.playCount);
    document.getElementById("playlistTrackCount").textContent = "歌曲数量：" + playlistInfo.trackCount;
    playlistTrackCount = playlistInfo.trackCount;
    console.log("这里一共有几首歌：" + playlistInfo.trackCount);
   
    const playlistAge = ~~((Date.now() - playlistInfo.createTime)/86400000);
    playlistHeat = playlistInfo.playCount / playlistAge;
    
    document.getElementById("playlistHeat").textContent = "歌单热度：" + playlistHeat;
    calculatePlaylistContributingFac();

    // Hide the loading indicator
    document.getElementById("loadingIndicator").style.display = "none";
  });
}

function calculatePlaylistContributingFac() {
  songRank = document.getElementById("playlistRanking").value;
  if (songRank > playlistTrackCount || songRank === 0) {
    console.log("输入排名为0/超过歌单歌曲数量");
    playlistContributingFactor = -1;
  } else {
    playlistContributingFactor = (1 - (songRank / playlistTrackCount)) * playlistHeat;
    console.log("歌单贡献因子是:" + playlistContributingFactor);
  }
}

function getPlaylistID(playlistLink) {
  // Extract the playlist ID from the link
  const playlistID = playlistLink.split("id=")[1];
  return playlistID;
}

function openPlaylistLink() {
  const playlistLink = document.getElementById("playlistLink").value;
  window.open(playlistLink, "_blank");
}

async function loadModel() {
  const modelPath = 'https://raw.githubusercontent.com/Dyrox/clouddrive/main/model2.json';
  const modelURL = tf.io.browserHTTPRequest(modelPath);
  const model = await tf.loadGraphModel(modelURL, tf.io.browserHTTPRequest('https://raw.githubusercontent.com/Dyrox/clouddrive/main/group1-shard1of1.bin'));
  return model;
}

async function predict() {
  const model = await loadModel();
  const input = tf.tensor2d([[playlistContributingFactor]]);
  const prediction = model.predict(input);
  const result = prediction.dataSync()[0];
  
  document.getElementById("predictionField").textContent = ~~result;
  if(result<100){
    // make the getElementById("predictionField red, else green
  }
  document.getElementById("predictionField").textContent = ~~result;
document.getElementById("predictmMoney").textContent = '¥' + (result / 400 * 30);

if (result < 100) {
  document.getElementById("predictionField").style.color = "red";
  document.getElementById("predictmMoney").style.color = "red";
} else {
  document.getElementById("predictionField").style.color = "green";
  document.getElementById("predictmMoney").style.color = "green";
}

  
}
