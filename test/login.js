const puppeteer = require('puppeteer');
const fs = require('fs');
const { PrismaClient }  = require('@prisma/client');

const prisma = new PrismaClient();

async function otpGet(idd){
    return await prisma.FK_User.findUnique({
      where: {
        id: idd,
      },
    });
}

(async () => {
    const number = '7697634314';
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto('https://www.flipkart.com');

    const loginLink = await page.$x("//a[contains(@class, '_1jKL3b') and text()='Login']");
    if (loginLink.length > 0) {
      await loginLink[0].click();
    } else {
      console.log("Login link not found.");
    }
    await page.waitForTimeout(2000);
    await page.waitForSelector('form[autocomplete="on"]');

    await page.type('input[class="_2IX_2- VJZDxU"]', number);
    const requestOTPButton = await page.$('button._2KpZ6l._2HKlqd._3AWRsL');
    if (requestOTPButton) {
        await requestOTPButton.click();
    }

    await page.waitForSelector('form div.HSKgdN');
    await page.waitForTimeout(5000); // Wait for 5 seconds as an example

    let chatText = "as";
    let targetText = "You";
    var Otp = '';
    let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
    let startTime = Date.now();
    while (chatText !== targetText) {
      var idd = 1;
      var otpcall = await otpGet(idd);
      console.log('data ',otpcall);
      if (otpcall.otp == null) {
        console.log("Otp Not Recieved");
      }else{
        console.log("Otp Read ",otpcall.otp);
        Otp = otpcall.otp;
        break;
      }
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= timeout) {
        break; 
      }  
      await page.waitForTimeout(2000);
    }

    await page.type('input[class="_2IX_2- _1WRfas"]', Otp);
    const otpClick = await page.$('button._2KpZ6l _14EHzR _3dESVI');
    if (otpClick) {
        await otpClick.click();
    }
    // Wait for the login process to complete
    await page.waitForNavigation();
    // Get and save the cookies
    const cookies = await page.cookies();
    require('fs').writeFileSync('./cookies.json', JSON.stringify(cookies));
    await prisma.FK_Session.create({
      data: {
        number: number, // Set the appropriate Number
        cookies: JSON.stringify(cookies),
      },
    });
    await browser.close();
})();