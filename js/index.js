let userInput, term;
let searchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentURL = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
let count = 0;

function setup() {
  noCanvas();
  userInput = select('#userInput');
  userInput.changed(startSearch);

  function startSearch() {
    count = 0;
    goWiki(userInput.value());
  }

  function goWiki(term) {
    count++;

    if (count <= 10) {
      let URL = `${searchURL}${term}`;
      loadJSON(URL, gotSearch, 'jsonp');
    }
  }

  function gotSearch(data) {
    let len = data[1].length;
    let index = floor(random(len));
    let title = data[1][index];
    title = title.replace(/\s+/g, '_');
    createDiv(`${count}. ${title}`).addClass('text-center');
    let URL = contentURL + title;
    console.log(`Querying ${URL}`);
    loadJSON(URL, gotContent, 'jsonp')
  }

  function gotContent(data) {
    let page = data.query.pages;
    let pageID = Object.keys(page)[0];
    let content = page[pageID].revisions[0]['*'];
    let wordRegex = /\b\w{4,}\b/g;
    let words = content.match(wordRegex);
    let word = random(words);
    goWiki(word);
  }
}
