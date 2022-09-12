import { LightningElement, wire, api, track } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { NavigationMixin } from 'lightning/navigation';

// Custom imports
import CONTACT_ID from "@salesforce/schema/User.ContactId";
import getUserDetails from '@salesforce/apex/getUserDetails.getUsers';

// this gets you the logged in user
import USER_ID from "@salesforce/user/Id";
export default class LoggedInUserWelcome extends NavigationMixin(LightningElement) {
  @api userId;
  @api bannerImage;
  @api button1URL;
  @api button2URL;
  @api button1Name;
  @api button2Name;

  @track usersName;
  @track fullPhotoUrl;
  @track userData;
  @track bannerImageURL;

  pictureUrl = 'https://various-poc-images.s3.amazonaws.com/LinkedIn+Banner+Image.jpg';
  headshotUrl = 'https://various-poc-images.s3.amazonaws.com/circle-cropped.png';

  connectedCallback() {
    console.log(`Value of button1URL: `, this.button1URL);
    this.bannerImageURL = (this.bannerImage ? this.bannerImage : this.pictureUrl);
    this.button1Name = (this.button1Name ? this.button1Name : 'Primary Button');
    this.button2Name = (this.button2Name ? this.button2Name : 'Secondary Button');
  }

  @wire(getRecord, { recordId: USER_ID, fields: [CONTACT_ID] })
  returnedUserData({data, error}) {
    if(data) {
      console.log(`Data returned from getRecord ==> `, data);
      this.userId = data.id;
    } else if(error) {
      window.console.log(`Error ==> `, error);
    }
  }

  @wire(getUserDetails, { recordId: '$userId' }) 
    returnedUserDetail({data, error}) {
      if(data) {
        this.usersName = data[0].Name;
        this.title = data[0].Title;
        this.fullPhotoUrl = data[0].FullPhotoUrl;
        this.userData = data;
        console.log(`Users Name ==> `, data);
      } else if (error) {
        window.console.log(`Error ==>`, error);
      }
    }

  get contactId() {
    return getFieldValue(this.user.data, CONTACT_ID);
  }

  navigateButton1() {
    // Navigate to the Account home page
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: this.button1URL
        },
    });
  }

  navigateButton2() {
    // Navigate to the Account home page
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: this.button2URL
        },
    });
  }


}