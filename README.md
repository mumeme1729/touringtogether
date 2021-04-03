# toringtogether
ツーリング仲間を目的地、日付から募集・検索できるアプリです。

### 背景  
自分自身バイクでツーリングするのが好きで基本はソロでツーリングを楽しんでいるが、  
複数人で出かけたくなる時もある。しかし、バイクを所数している友人は少ない。  
また、SNSなのでツーリング仲間を探してみたが、予定が合わなかったり  
本来行きたかった目的地に行けなかったりとなかなかうまくいかなかったことがあった。  
そこで、直接目的地と日付から仲間を探せるようなアプリを作成した。  

### 使用技術  
・Django REST framework
・S3
・React
・Redux ToolKit
#### 環境
VPS conoHa  
Ubuntu Gunicorn nginx  

### 使用方法  
ログイン・新規アカウント作成を行います。  
<img src="https://user-images.githubusercontent.com/28708899/113473025-ee160c80-94a1-11eb-9d62-5fdc1155de4b.jpg" width="550">  


TOPページでは新規プランが表示され、都道府県、目的地、日付からプランを検索できます。  
目的地検索は部分一致です。  
メニューは上から  
・TOP: トップページに戻る  
・通知: フォローされたりプランにコメントがつくと通知が届く  
・プラン: フォローしたユーザーのプランを表示  
・プランを投稿する: 新規にプランを投稿する  
・ログインしているユーザーのプロフィール画面に遷移  
<img src="https://user-images.githubusercontent.com/28708899/113473134-9e841080-94a2-11eb-98bc-bc1673b5806f.jpg" width="550">  

プラン表示画面ではコメントを投稿することができます。  
<img src="https://user-images.githubusercontent.com/28708899/113473328-fcfdbe80-94a3-11eb-8ad8-c86006ed2350.jpg" width="550">  


プロフィール画面ではユーザーのフォローor解除、投稿したプラン、コメントしたプラン、いいねしたプラン  
をみることができます。  
ログインユーザーのプロフィール画面ではログアウト、プロフィール情報の更新が行えます。  
<img src="https://user-images.githubusercontent.com/28708899/113473328-fcfdbe80-94a3-11eb-8ad8-c86006ed2350.jpg" width="550">







