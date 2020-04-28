const fs = require('fs');
var cron = require('node-cron');
var moment = require('moment');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const axios = require('axios').default;
require('dotenv').config();

var task = cron.schedule('0 0 * * * *', () => {
  console.log('Checking My Mini Factory');
  console.log(moment().format());
  // purchasePage = 'https://www.myminifactory.com/product/elegoo-mars-pro-limited-edition';
  listingPage = 'https://www.myminifactory.com/products';
  // miniAxios = axios.get(miniUrl)

  // fetch(purchasePage)
  //   .then((res) => res.text())
  //   .then((body) => {
  //     fs.writeFileSync('.\\purchasePage.html', body, 'utf8');
  //     html = cheerio.load(body);
  //     // console.log(html);
  //     // console.log(html('.pay-button'));
  //   });

  fetch(listingPage)
    .then((res) => res.text())
    .then((body) => {
      soldOut = true;
      // fs.writeFileSync('.\\listingPage.html', body, 'utf8');
      try {
        html = cheerio.load(body);
        // console.log(html);
        storeData = JSON.parse(html('.js-react-on-rails-component').get()[0].children[0].data);
        // console.log(storeData);
        pro = storeData.storePrinters.find((printer) => printer.name === 'MyMiniFactory Elegoo Mars PRO');
        // console.log(pro);
        // console.log(pro.status);
        soldOut = pro.status === 'sold-out';
        if (!soldOut) {
          console.log('Not Sold Out!!');
          axios.post(process.env.slackUrl, { text: 'The Elegoo Mars Pro may not be sold out any more' });
          axios.post(process.env.discordUrl, { content: 'The Elegoo Mars Pro may not be sold out any more' });
        }
        console.log('Still sold out... Bummer Man');
      } catch (err) {
        console.log('Try Catch Error!');
        console.log(err);
        axios.post(process.env.slackUrl, {
          text: 'There was an error trying to Parse the My Mini Factory response.',
        });
        axios.post(process.env.discordUrl, {
          content: 'There was an error trying to Parse the My Mini Factory response.',
        });
      }
    })
    .catch((err) => {
      console.log('Fetch Error!');
      console.log(err);
      axios.post(process.env.slackUrl, {
        text: 'There was an error trying to Fetch the My Mini Factory data.',
      });
      axios.post(process.env.discordUrl, {
        text: 'There was an error trying to Fetch the My Mini Factory data.',
      });
    });
});

task.start();
