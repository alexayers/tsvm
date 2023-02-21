import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {DataBusService} from "../services/data-bus/data-bus.service";

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit, OnDestroy {

  message: string | undefined;
  subscription: Subscription | undefined;


  constructor(private data: DataBusService) {


  }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.message= message)
  }

  execute(value: string) {

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../vm.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.data.changeMessage(data);
      };

      worker.postMessage(value);


    } else {
      console.error("Web Workers are not supported!");
    }



  }

  ngOnDestroy() {
    // @ts-ignore
    this.subscription.unsubscribe();
  }

  processCode(innerText: string) {


    let keywords = ["mov"];
    let newHTML = "";
    // Loop through words
    innerText.replace(/[\s]+/g, " ").trim().split(" ").forEach(function(val) {
      // If word is statement
      if (keywords.indexOf(val.trim()) > -1) {
        newHTML += "<span class='statement'>" + val + "&nbsp;</span>";
      } else {
        newHTML += "<span class='other'>" + val + "&nbsp;</span>";
      }
    });


  }

}
