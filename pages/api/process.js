const puppeteer = require('puppeteer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient }  = require('@prisma/client');


const prisma = new PrismaClient();

async function otpGet(idd){
    return await prisma.FK_Details.findMany({
        where: {
            cardno: idd,
        },
    });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {affiliat,product,custName,accountNo,custNumber,custPincode,locality,custAddress,custBankname,cardno,month,year,cvv} = req.body;
        console.log('data',affiliat,product,custName,accountNo,custNumber,custPincode,locality,custAddress,custBankname,cardno,month,year,cvv);
        const flink = affiliat;
        var plink = product;
        const myArray = plink.split("com/")[1];
        const productlink = myArray.split("/")[0];
        const nameset = custName;
        const accountPhoneNo = accountNo;
        const numberset = custNumber;
        const pincodeset = custPincode;
        const addressset1 = locality;
        const addressset2 = custAddress;
        const bankname = custBankname;
        const cardnoset = cardno;
        const monthset = month;
        const yearset = year;
        const cvvset = cvv;

        const sessions = await prisma.FK_Session.findMany({
            where: {
                number: accountPhoneNo // Replace with the desired phone number
            }
        });
        if (sessions.length > 0  && sessions[0].cookies) {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();

            await page.setCookie(...JSON.parse(sessions[0].cookies));

            await page.waitForTimeout(2000);
            await page.goto(flink);
            const CreateFkDetails = await prisma.FK_Details.create({
                data: {
                    account_holder_number:accountPhoneNo,
                    name: nameset,
                    number: numberset,
                    pincode: pincodeset,
                    locality: addressset1,
                    address: addressset2,
                    bankname: bankname,
                    cardno: cardnoset,
                    cardmonth: monthset,
                    cardyear: yearset,
                    cardcvv: cvvset,
                    affiliate_link: flink,
                    productlink: productlink,
                }
            });
            console.log('create data',CreateFkDetails);
            await page.waitForTimeout(3000);
            // Search for a product
            await page.waitForSelector('form._2M8cLY input[name="q"]');
            await page.waitForTimeout(2000);
            await page.type('form._2M8cLY input[name="q"]', productlink);
            await page.waitForTimeout(2000);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(5000);
            await page.waitForSelector('a._1fQZEK'); // Wait for the product name element
            const productNameElement = await page.$('a._1fQZEK'); // Get the product name element
            const newPagePromise = new Promise(resolve => browser.once('targetcreated', resolve));
            await productNameElement.click(); // Trigger the click to open the new tab
            const newTarget  = await newPagePromise;
            const newPage = await newTarget.page();
            await newPage.waitForTimeout(6000);
            await newPage.waitForSelector('button._2KpZ6l._2U9uOA.ihZ75k._3AWRsL');
            await newPage.waitForTimeout(1000);
            await newPage.click('button._2KpZ6l._2U9uOA.ihZ75k._3AWRsL');
            console.log('New tab page is ready');
            await newPage.waitForTimeout(3000);
        
            // form start  address
            const buttons = await newPage.$$('button._32l7f0');
            if (buttons.length >= 2) {
              await buttons[1].click(); // Click the second button
            } else {
              console.log("The second button does not exist.");
            }
            await newPage.waitForTimeout(3000);
            await newPage.waitForSelector('div._1AXmWp button._1MM7ZD'); // Wait for the button to appear
            const editButton = await newPage.$('div._1AXmWp button._1MM7ZD'); // Get the button element
            await editButton.click();
            await newPage.waitForTimeout(2000);
            await newPage.waitForSelector('input._1w3ZZo._2mFmU7[name="name"]');
            const nameInput = await newPage.$('input._1w3ZZo._2mFmU7[name="name"]'); 
            await nameInput.click({ clickCount: 3 }); 
            await nameInput.press('Backspace'); // Delete the selected text
            await nameInput.type(nameset, { delay: 100 });
            await newPage.waitForTimeout(1000);
            const phoneInput = await newPage.$('input._1w3ZZo._2mFmU7[name="phone"]'); 
            await phoneInput.click({ clickCount: 3 }); 
            await phoneInput.press('Backspace'); // Delete the selected text
            await phoneInput.type(numberset, { delay: 100 });
            await newPage.waitForTimeout(1000);
            const pincodeInput = await newPage.$('input._1w3ZZo._2mFmU7[name="pincode"]'); 
            await pincodeInput.click({ clickCount: 3 }); 
            await pincodeInput.press('Backspace'); // Delete the selected text
            await pincodeInput.type(pincodeset, { delay: 100 });
            await newPage.waitForTimeout(1000);
            const addressInput2 = await newPage.$('input._1w3ZZo._2mFmU7[name="addressLine2"]'); 
            await addressInput2.click({ clickCount: 3 }); 
            await addressInput2.press('Backspace'); // Delete the selected text
            await addressInput2.type(addressset2, { delay: 100 });
            await newPage.waitForTimeout(1000);
            const addressInput1 = await newPage.$('textarea._1sQQBU._1w3ZZo._1TO48q[name="addressLine1"]'); 
            await addressInput1.click({ clickCount: 3 }); 
            await addressInput1.press('Backspace'); // Delete the selected text
            await addressInput1.type(addressset1, { delay: 100 });
            await newPage.waitForTimeout(1000);
            await newPage.waitForSelector('button._2KpZ6l._1JDhFS._3AWRsL'); // Wait for the button to appear
            await newPage.click('button._2KpZ6l._1JDhFS._3AWRsL'); 
        
            // form end address
        
            // form start GST  
        
            // await newPage.waitForTimeout(2000); // ._2KpZ6l._2L6-px
            // await newPage.waitForSelector('button._2KpZ6l._2L6-px'); // Wait for the button to appear
            // await newPage.click('button._2KpZ6l._2L6-px');
        
            // form end GST
            
        
            // Start with continue
            await newPage.waitForTimeout(3000);
            const svgImage = await newPage.$x("//img[@src='data:image/svg+xml;base64,PHN2ZyB...']");
            if (svgImage.length > 0) {
                await svgImage[0].click();
            }else{
                console.log('Cros Image not Found');
            }
            await newPage.waitForTimeout(2000);
            await newPage.waitForSelector('span#to-payment button._2KpZ6l._1seccl._3AWRsL'); // Wait for the button to appear
            await newPage.click('span#to-payment button._2KpZ6l._1seccl._3AWRsL'); //_2KpZ6l _1uR9yB _3dESVI
            await newPage.waitForTimeout(3000); 
            const acceptButton = await newPage.$x("//button[contains(., 'Accept & Continue')]");
            if (acceptButton.length > 0) {
              await acceptButton[0].click();
            } else {
              console.log("Accept & Continue button not found.");
            }
            await newPage.evaluate(() => {
                window.scrollBy(0, 500); // Scroll down by 500 pixels
            });
            await newPage.waitForTimeout(3000); 
            const checkOpenBox = await newPage.waitForSelector('div._2jIO64._3Uc2dx'); // Wait for the button to appear
            if(checkOpenBox){
                console.log('open box availble');
                await newPage.click('div._2jIO64._3Uc2dx');
                await newPage.waitForTimeout(3000); 
                await newPage.waitForSelector('label[for="EMI_OPTIONS"]'); // Wait for the label element to appear
                await newPage.click('label[for="EMI_OPTIONS"]'); // Click the label
                await newPage.waitForTimeout(5000);
                console.log('EMI_OPTIONS'); 
                const noCostEMIXPath = '//label[@for="no_cost_1"]';
                const noCostEMI = await newPage.$x(noCostEMIXPath);
                if (noCostEMI.length > 0 ) {
                    await noCostEMI[0].click();
                    // const noCostEMI = await newPage.$('label[for="no_cost_1"] .l3zHub'); // Get the element for No Cost EMI
                    // console.log('no costemi');
                    // await noCostEMI.click();
                    await newPage.waitForTimeout(1000);
                    console.log('no after');
                    await newPage.waitForSelector('.xbWKKZ');
                    console.log('afer no after');
                    const elementXPath = `//div[contains(text(), '${bankname}')]`;
                    const matchingElements = await newPage.$x(elementXPath);
                    console.log(matchingElements.length);
                    if(matchingElements.length > 0){
                        console.log('No cost emi available');
                        const [elementHandle] = await newPage.$x(elementXPath);
                        if (elementHandle) {
                            await elementHandle.click();   
                            await newPage.waitForTimeout(5000);
                            console.log('after 5 sec call');
                            const radioButtonValue = '9'; 
                            await newPage.click(`input[name="emi-tenure"][id="${radioButtonValue}"]`);
                            await newPage.waitForTimeout(2000);
                            await newPage.waitForSelector('button._2KpZ6l._3zWv-I._3AWRsL'); // Wait for the button to appear
                            await newPage.click('button._2KpZ6l._3zWv-I._3AWRsL');
                            await newPage.waitForTimeout(3000);
                            await afterCredit(newPage,cardnoset,monthset,yearset,cvvset);
                        } else {
                            console.log("Bank Select Element not found");
                        }
                    }else{
                        await newPage.waitForTimeout(3000);
                        await newPage.evaluate(() => {
                            window.scrollBy(0, -300); // Scroll down by 500 pixels
                        });
                        await newPage.waitForTimeout(3000);
                        await newPage.waitForSelector('label[for="CREDIT"]'); 
                        await newPage.click('label[for="CREDIT"]');
                        await newPage.waitForTimeout(1000);
                        await afterCredit(newPage,cardnoset,monthset,yearset,cvvset);
                    }
                } else {
                  console.log('No Cost EMI element not found.');
                  await newPage.waitForTimeout(3000);
                  await newPage.evaluate(() => {
                      window.scrollBy(0, -300); // Scroll down by 500 pixels
                  });
                  await newPage.waitForTimeout(3000);
                  await newPage.waitForSelector('label[for="CREDIT"]'); 
                  await newPage.click('label[for="CREDIT"]');
                  await newPage.waitForTimeout(1000);
                  await afterCredit(newPage,cardnoset,monthset,yearset,cvvset);
                }
            }else{
                console.log('box not available');
            } 
            // await browser.close();
        }else{
            res.status(500).json({ message: 'No Session Found On This Number' });
        }
        
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}


async function afterCredit(newPage,cardnoset,monthset,yearset,cvvset){
    const cardNumberInput = await newPage.waitForSelector('input._1w3ZZo._2mFmU7[autocomplete="cc-number"]');
    await cardNumberInput.type(cardnoset);
    await newPage.waitForTimeout(1000)
    const monthDropdown = await newPage.waitForSelector('select._2t2oBT._1wEi1H._9IYuSq[name="month"]');
    await monthDropdown.select(monthset); 
    await newPage.waitForTimeout(1000);
    const yearDropdown = await newPage.waitForSelector('select._2t2oBT._1wEi1H[name="year"]');
    await yearDropdown.select(yearset);
    await newPage.waitForTimeout(1000);
    const cvvInput = await newPage.waitForSelector('input._1w3ZZo._2mFmU7[autocomplete="cc-csc"]');
    await cvvInput.type(cvvset);
    await newPage.waitForTimeout(3000);
    await newPage.waitForSelector('button._2KpZ6l._2nejCf._3AWRsL'); // Wait for the button to appear
    await newPage.click('button._2KpZ6l._2nejCf._3AWRsL');
    await newPage.waitForTimeout(5000);
    await newPage.waitForSelector('button._2KpZ6l._1OyArl._3AWRsL'); // Wait for the button to appear
    await newPage.click('button._2KpZ6l._1OyArl._3AWRsL');
    await newPage.waitForTimeout(9000);
    const elementXPath = '//input[@class="form-control" and @name="otpPassword"]';
    const matchingElements = await newPage.$x(elementXPath);
    if(matchingElements.length > 0){
        console.log('in the arry');
        let chatText = "as";
        let targetText = "You";
        var Otp = '';
        let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
        let startTime = Date.now();
        while (chatText !== targetText) {
            var idd = cardnoset;
            var otpcall = await otpGet(idd);
            if (otpcall[0].purchase_otp == null) {
                console.log("Otp Not Recieved");
            }else{
                console.log("Otp Read ",otpcall[0].purchase_otp);
                Otp = otpcall[0].purchase_otp;
                break;
            }
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= timeout) {
                break; 
            }  
            await newPage.waitForTimeout(2000);
        }
        await matchingElements[0].type(Otp);
        await newPage.waitForTimeout(2000);
        await newPage.waitForSelector('input.btn.btn-light.btn-sm[name="cmdSubmit"]');
        await newPage.click('input.btn.btn-light.btn-sm[name="cmdSubmit"]');
        await newPage.waitForTimeout(2000);
        // Perform further interactions here
    } else {
        console.log('Element does not exist');
        const otpInputXPath = '//input[@id="otp"]';
        const matchingOTPInputs = await newPage.$x(otpInputXPath);
        if (matchingOTPInputs.length > 0) {
            console.log('second element ');
            let chatText = "as";
            let targetText = "You";
            var Otp = '';
            let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
            let startTime = Date.now();
            while (chatText !== targetText) {
                var idd = cardnoset;
                var otpcall = await otpGet(idd);
                if (otpcall[0].purchase_otp == null) {
                    console.log("Otp Not Recieved");
                }else{
                    console.log("Otp Read ",otpcall[0].purchase_otp);
                    Otp = otpcall[0].purchase_otp;
                    break;
                }
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime >= timeout) {
                    break; 
                }  
                await newPage.waitForTimeout(2000);
            }
            await matchingOTPInputs[0].type(Otp);
            await newPage.waitForTimeout(2000);
            const submitButtonXPath = '//input[@id="onusOtpBtn"]';
            const matchingSubmitButtons = await newPage.$x(submitButtonXPath);
            await matchingSubmitButtons[0].click();

        }else{
            console.log('second element not Found ');
            const inputXPath = '//input[@type="password" and @name="otpPassword"]';
            const passwordInput = await newPage.$x(inputXPath);
            if (passwordInput.length > 0) {
                console.log('second element ');
                let chatText = "as";
                let targetText = "You";
                var Otp = '';
                let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
                let startTime = Date.now();
                while (chatText !== targetText) {
                    var idd = cardnoset;
                    var otpcall = await otpGet(idd);
                    if (otpcall[0].purchase_otp == null) {
                        console.log("Otp Not Recieved");
                    }else{
                        console.log("Otp Read ",otpcall[0].purchase_otp);
                        Otp = otpcall[0].purchase_otp;
                        break;
                    }
                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime >= timeout) {
                        break; 
                    }  
                    await newPage.waitForTimeout(2000);
                }
                await passwordInput[0].type(Otp);
                await newPage.waitForTimeout(2000);
                const submitButtonXPath3 = '//input[@type="submit" and @name="cmdSubmit"]';
                const matchingSubmitButtons3 = await newPage.$x(submitButtonXPath3);
                await matchingSubmitButtons3[0].click();
    
            }else{
                console.log('third element not Found ');
                const otpInputElement = await newPage.$x("//input[@id='otpValue']");
                if (otpInputElement.length > 0) {
                    console.log('second element ');
                    let chatText = "as";
                    let targetText = "You";
                    var Otp = '';
                    let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
                    let startTime = Date.now();
                    while (chatText !== targetText) {
                        var idd = cardnoset;
                        var otpcall = await otpGet(idd);
                        if (otpcall[0].purchase_otp == null) {
                            console.log("Otp Not Recieved");
                        }else{
                            console.log("Otp Read ",otpcall[0].purchase_otp);
                            Otp = otpcall[0].purchase_otp;
                            break;
                        }
                        const elapsedTime = Date.now() - startTime;
                        if (elapsedTime >= timeout) {
                            break; 
                        }  
                        await newPage.waitForTimeout(2000);
                    }
                    await otpInputElement[0].type(Otp);
                    await newPage.waitForTimeout(2000);
                    const confirmButton = await newPage.$x("//a[contains(@class, 'btn primary__btn') and text()='CONFIRM']");
                    if (confirmButton.length > 0) {
                        await confirmButton[0].click();
                    }else{
                        await newPage.waitForTimeout(2000);
                        const submitButton = await newPage.$x("//button[@id='submitBtn']");
                        if (submitButton.length > 0) {
                            await submitButton[0].click();
                        } else {
                            console.log("Submit button not found.");
                        }
                    }
        
                }else{
                    console.log('Fourth element not Found ');
                    const otpInput = await newPage.$x("//input[contains(@class, '_8kOJmP')]");
                    if (otpInput.length > 0) {
                        console.log('second element ');
                        let chatText = "as";
                        let targetText = "You";
                        var Otp = '';
                        let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
                        let startTime = Date.now();
                        while (chatText !== targetText) {
                            var idd = cardnoset;
                            var otpcall = await otpGet(idd);
                            if (otpcall[0].purchase_otp == null) {
                                console.log("Otp Not Recieved");
                            }else{
                                console.log("Otp Read ",otpcall[0].purchase_otp);
                                Otp = otpcall[0].purchase_otp;
                                break;
                            }
                            const elapsedTime = Date.now() - startTime;
                            if (elapsedTime >= timeout) {
                                break; 
                            }  
                            await newPage.waitForTimeout(2000);
                        }
                        await otpInput[0].type(Otp);
                        await newPage.waitForTimeout(2000);
                        const xpathExpression = await newPage.$x("//button[contains(@class, '_2KpZ6l') and contains(@class, '_1RbBLK') and contains(@class, '_3AWRsL')]");
                        await xpathExpression[0].click();
                    }else{
                        console.log('Fifth Element not Found');
                        const inputElementset = await newPage.$x("//input[contains(@class, '_8kOJmP')]");
                        if (inputElementset.length > 0) {
                            console.log('second element ');
                            let chatText = "as";
                            let targetText = "You";
                            var Otp = '';
                            let timeout = 2 * 60 * 1000; // 2 minutes in milliseconds
                            let startTime = Date.now();
                            while (chatText !== targetText) {
                                var idd = cardnoset;
                                var otpcall = await otpGet(idd);
                                if (otpcall[0].purchase_otp == null) {
                                    console.log("Otp Not Recieved");
                                }else{
                                    console.log("Otp Read ",otpcall[0].purchase_otp);
                                    Otp = otpcall[0].purchase_otp;
                                    break;
                                }
                                const elapsedTime = Date.now() - startTime;
                                if (elapsedTime >= timeout) {
                                    break; 
                                }  
                                await newPage.waitForTimeout(2000);
                            }
                            await inputElementset[0].type(Otp);
                            await newPage.waitForTimeout(2000);
                            const buttonElement = await newPage.$x("//button[contains(@class, '_2KpZ6l') and contains(@class, '_1RbBLK') and contains(@class, '_3AWRsL')]");
                            await buttonElement[0].click();
                        }else{
                            console.log('six  Element not Found');
                        }
                    }
                    
                }
            }
        }
    }

}