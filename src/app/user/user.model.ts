export class User {
  id: String;
  nick: String;
  pic: String;

  constructor(data:any) {
    this.id = data && data.id;
    this.nick = data && data.nick;
    this.pic = data && data.pic && data.pic.url;
  }
}
