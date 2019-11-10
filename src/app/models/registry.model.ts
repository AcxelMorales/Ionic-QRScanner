export class Registry {

  public format   : string;
  public text     : string;
  public type     : string;
  public icon     : string;
  public createdAt: Date;

  constructor(format: string, text: string) {
    this.format    = format;
    this.text      = text;
    this.createdAt = new Date();
    this.determineType();
  }

  private determineType(): void {
    const initialText = this.text.substr(0, 4);
    console.log(initialText)

    switch (initialText) {
      case 'http':
        this.type = 'http';
        this.icon = 'globe';
        break;
      case 'geo:':
        this.type = 'geo';
        this.icon = 'pin';
        break;
      default:
        this.text = 'No recognized';
        this.icon = 'create';
        break;
    }
  }

}