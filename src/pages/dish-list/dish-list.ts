import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DishService} from '../../providers/dish-service-mock';
import * as firebase from "firebase";
import 'firebase/firestore';
import { AlertController } from 'ionic-angular';
@IonicPage({
	name: 'page-dish-list',
	segment: 'dish-list'
})

@Component({
	selector: 'page-dish-list',
	templateUrl: 'dish-list.html'
})
export class DishListPage {
	dishes: Array<any>=[];
	orders: Array<any>=[];
	stores: Array<any>=[];
	code : Array<any>=[];
	public reviewCollection :any;
	public storeCollection : any;
	public  db = firebase.firestore();
	public user:any;
	store_code : any;
	reviews : Array<any>=[];
	doc_id :any;
	constructor(public navCtrl: NavController, public dishService: DishService, public alert:AlertController) {
		//this.dishes = this.dishService.findAll();
		this.openReviewList();
	}
	//

	async reviewListAsync(){
		let reviewlist = await this._reviewlist();
		return reviewlist;
	}
	_reviewlist():Promise<any>{
		return new Promise<any>(resolve => {
				var reviews: Array<any>=[];

				var reviewRef = this.db.collection('review');
				var rev = reviewRef.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							console.log(doc.data())
							reviews.push({
								content : doc.data().content,
								store : doc.data().store_name,
								menu : doc.data().menu,
								star : doc.data().star,
								time : doc.data().time,
								user_id : doc.data().user_id,
								orderDoc_id : doc.data().orderDoc_id
							})
						});
						console.log("review", reviews)
						resolve(reviews)
					})
					.catch(err => {
						console.log('Error getting documents', err);
					});

			}
		)
	}



	openReviewList(){
		var menu_a = this.reviewListAsync()
			.then((reviews)=> this.reviews = reviews)
			.catch();

		// this.user = firebase.auth().currentUser.email;
		 console.log(this.reviews);
	}
	presentAlert(id) {

		let alert = this.alert.create({
			title: "Do you really want to delete the review?",
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: 'YES',
					handler: () => {
						this.deleteReview(id)
					}
				}
			]
		});
		alert.present();
	}
	deleteReview(id){
		var orderdoc_id = this.reviews[id].orderDoc_id;

		var reviewRef = this.db.collection('review').where("orderDoc_id", "==", orderdoc_id).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {
				const reviewid = change.doc.id;
				this.db.collection('review').doc(reviewid).delete().then(()=>
					this.updateOrder(orderdoc_id)).then(()=>this.presentAlert2()).then(()=>this.navCtrl.setRoot('page-home')).catch(err=> console.log("error"));
				// do something with foo and fooId
				//resolve();
			})
		})
	}
	updateOrder(orderdoc_id) {

		var orderRef = this.db.collection('order').where("id", "==", orderdoc_id).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {

				const fooId = change.doc.id
				this.db.collection('order').doc(fooId).update({review: false});
				// do something with foo and fooId

			})
		});
	}
	presentAlert2() {

		let alert = this.alert.create({
			title: "Deleted Review",
			buttons: ["OK"]
		});
		alert.present();
	}
}
