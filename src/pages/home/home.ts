import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, ToastController, ModalController } from 'ionic-angular';
import {CategoryService} from '../../providers/category-service-mock';
import {RestaurantService} from '../../providers/restaurant-service-mock';

@IonicPage({
	name: 'page-home',
	segment: 'home',
	priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	categories: Array<any>;
  restaurants: Array<any>;
  searchKey: string = "";

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public service1: CategoryService, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService) {
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
		this.findAll();
  }

  openRestaurantListPage(id) {
  	if(id==0){
		this.navCtrl.push('page-dish-list');
	}else if(id==1){
		this.navCtrl.push('page-event');
	}else if(id==2){
		this.navCtrl.push('page-cart');
	}
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }
	onCancel(event) {
	    this.findAll();
	}

	findAll() {
		this.service1.findAll()
			.then(data => this.categories = data)
			.catch(error => alert(error));
	}

  ionViewWillEnter() {
      this.navCtrl.canSwipeBack();
  }

}
