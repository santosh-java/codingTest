import { CodeTestPage } from './app.po';

describe('code-test App', () => {
  let page: CodeTestPage;

  beforeEach(() => {
    page = new CodeTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
