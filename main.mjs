// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

// .envファイルから環境変数を読み込み
dotenv.config();

// Discord Botクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // サーバー情報取得
        GatewayIntentBits.GuildMessages,    // メッセージ取得
        GatewayIntentBits.MessageContent,   // メッセージ内容取得
        GatewayIntentBits.GuildMembers,     // メンバー情報取得
    ],
});

// Botが起動完了したときの処理
client.once('ready', () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    console.log(`📊 ${client.guilds.cache.size} つのサーバーに参加中`);
});

// メッセージが送信されたときの処理
client.on('messageCreate', (message) => {
    // Bot自身のメッセージは無視
    if (message.author.bot) return;
    
    // 「ping」メッセージに反応
    if (message.content.toLowerCase() === 'ping') {
        message.reply('🏓 pong!');
    }
  if  (message.isMemberMentioned(client.user) && message.content.match(/おみくじして/))){
    let arr = ["今日はいい日になりそうだよ", "スヴァルが腕にアンパンマン描いてくれるかも！", "スバルくんがおすすめのお菓子屋さん紹介してくれるかも！", "気が向かなくて下を向いてたら、思いがけない発見があるかもよ", "君の好きなものが特売しているかも！", "道端でねこちゃん見かけるかも！"];
    lottery(message.channel.id, arr);
  }else if (message.isMemberMentioned(client.user)) {
    sendReply(message, "呼んだ？");
  }

    if (message.content.toLowerCase() === '褒めて') {
     let homekotoba = ["今日もがんばっててえらい！","すごいよ！本当によく頑張ってるねえ！","たいへんよくがんばりました！花丸だよ！","君が今まで頑張ったことが、全部反映されてるね！すごいや！","ナイス〜！ハイタッチしようよ🙌"]
     let homeru = homekotoba[Math.floor(Math.random() * homekotoba.length)];
        message.reply(homeru);
        console.log(`📝 ${message.author.tag} が ほめて コマンドを使用`);
    }
   if (message.content.toLowerCase() === '慰めて') {
     let nagusame = ["大丈夫、今日という日は無駄にならないよ。でも、しんどかったねえ","よしよし、大丈夫だよ。君が頑張っているの、俺がちゃんと知っているからさ","落ち込んでいる時はとことん落ち込んじゃおう！しんどい気持ちは君の大切な感情だからさ、そっとその気持ちを撫でてあげようね"]
     let koekake = nagusame[Math.floor(Math.random() * nagusame.length)];
        message.reply(koekake);
        console.log(`📝 ${message.author.tag} が なぐさめて コマンドを使用`);
    }
 // リアクションで反応してくれる
    if (message.content.includes('のどかわいた')) {
    let drink = ["🍵","🧃","🥤","🧋","🍹","🥛"]
    let bar = drink[Math.floor(Math.random() * drink.length)];
        message.react(bar);

     
}
      if (message.content.includes('おやつたべたい')) {
    let snack = ["🥨","🥞","🍡","🍧","🍨","🍭","🍫","🍩","🍪"]
    let pick = snack[Math.floor(Math.random() * snack.length)];
        message.react(pick);
      }
  if (message.content.includes('ごほうびほしい')) {
        message.react("🍬");message.react("💯");message.react("💮");message.react("🎖️");
    }
    if (message.content.includes('みてみて')) {
        message.react("👀");message.react("💭");message.react("‼️");message.react("👏");message.react("👍");
    }
     if (message.content.includes('具合悪い')) {
        message.reply("大丈夫？無理はしないで、少し布団で休んでおいで。\n悪くなるようなら病院に行くんだよ。");

  }
        if (message.content.includes('神無月くーん')) {
        message.reply("はいはーい、神無月だよ。どうしたのかな？");
        }
         if (message.content.includes('おなかすいた')) {
    let food = ["🍙","🍜","🍛","🍕","🍣"]
    let demae = food[Math.floor(Math.random() * food.length)];
        message.react(demae);
         }
          if (message.content.includes('つらい')) {
        message.react("🫂");
    }
      if (message.content.includes('しんどい')) {
        message.react("🫂");
    }
}
 );

// リプライきたらの反応

function lottery(channelId, arr){
  let random = Math.floor( Math.random() * arr.length);
  sendMsg(channelId, arr[random]);
}

// エラーハンドリング
client.on('error', (error) => {
    console.error('❌ Discord クライアントエラー:', error);
});

// プロセス終了時の処理
process.on('SIGINT', () => {
    console.log('🛑 Botを終了しています...');
    client.destroy();
    process.exit(0);
});

// Discord にログイン
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN が .env ファイルに設定されていません！');
    process.exit(1);
}

console.log('🔄 Discord に接続中...');
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('❌ ログインに失敗しました:', error);
        process.exit(1);
    });

// Express Webサーバーの設定（Render用）
const app = express();
const port = process.env.PORT || 3000;

// ヘルスチェック用エンドポイント
app.get('/', (req, res) => {
    res.json({
        status: 'Bot is running! 🤖',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`🌐 Web サーバーがポート ${port} で起動しました`);
});
