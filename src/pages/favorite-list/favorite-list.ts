import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import * as firebase from "firebase";

@IonicPage({
	name: 'page-favorite-list',
	segment: 'favorites'
})

@Component({
    selector: 'page-favorite-list',
    templateUrl: 'favorite-list.html'
})

export class FavoriteListPage {
	noticeTitle: string;
	noticeContent: string;
    favorites: Array<any> = [];
	public  db = firebase.firestore();
	date : any;

    constructor(public navCtrl: NavController, public service: RestaurantService, private alertCtrl: AlertController) {
        // this.getFavorites();
        // console.log(this.favorites);
    }
	addReview(){
		var success  = this.addReviewAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.setRoot('page-home');}).catch();
		//console.log("result:",success);

	}
	async addReviewAsync(){
		let review = await this._addreview();
		return review;
	}

	_addreview():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			var addDoc = this.db.collection('notice').add({
				title : this.noticeTitle,
				content : this.noticeContent,
				timeStamp: this.date
			}).then(ref=>{
				resolve(success);
				console.log('Added document');
			})

			//   resolve(store);
		})
	}
	presentAlert() {
		let alert = this.alertCtrl.create({
			title: "Notice added",
			buttons: ['OK']
		});
		alert.present();
	}


}
