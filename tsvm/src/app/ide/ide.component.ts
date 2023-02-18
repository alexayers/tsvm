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

  constructor(private data: DataBusService) { }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.message= message)
  }

  execute(value: string) {
    console.log(value);


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
}
