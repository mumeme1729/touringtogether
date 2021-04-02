# toringtogether
### 説明
ツーリング仲間を目的地、日付から募集・検索できるアプリです。

### 使用技術
##### バックエンド
    ・Django
 VPS サービスconohaを使用  
 BD:Postgres
##### フロントエンド
  　・TypeScript
    ・React
    ・Redux ToolKit
 
### 使用方法
ログイン又はアカウントを作成することで使用できます。  
ゲスト用アカウント  
email:gest@examole.com
password:qwerty  
<img src="https://user-images.githubusercontent.com/28708899/113418968-7690a080-9401-11eb-95b5-7d483b35d0d9.jpg" width="580px">

ログインするとトップページに遷移します。  
トップページでは新着のプランが表示されます。  
また、都道府県、目的地、日付からプランを検索できます。
左のメニューは上から  
・TOP:トップページに戻る。  
・通知:他のユーザーからフォローされたり投稿したプランにコメントがついたとき通知されます。  
・プラン:フォローしたユーザーのプランを表示します。  
・プランを投稿する:新たにプランを投稿します。  
・プロフィール：ログインしているユーザーのプロフィールを表示します。

<img src="https://user-images.githubusercontent.com/28708899/113419200-f1f25200-9401-11eb-963d-5e00ce96a196.jpg" width="580px">


プランページではコメントを投稿することができます。  
<img src="https://user-images.githubusercontent.com/28708899/113420029-8dd08d80-9403-11eb-9b7e-cf108a62d908.jpg" width="580px">  

アイコンをクリックすることでユーザーのプロフィール画面に遷移します。  
プロフィール画面では以下のことが行えます。  
・フォロー or 解除
・投稿したプラン、コメントしたプラン、いいねしたプランの表示  
・プロフィール情報の編集
・ログアウト  
<img src="https://user-images.githubusercontent.com/28708899/113420203-db4cfa80-9403-11eb-92ee-a4b360e8d17e.jpg" width="580px">

