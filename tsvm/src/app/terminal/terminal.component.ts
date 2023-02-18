import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {DataBusService} from "../services/data-bus/data-bus.service";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit , OnDestroy{

  message: string | undefined;
  subscription: Subscription | undefined;

  constructor(private data: DataBusService) { }
  terminal: any;
  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.terminal = message)
  }

  ngOnDestroy() {
    // @ts-ignore
    this.subscription.unsubscribe();
  }

  newMessage() {
    this.data.changeMessage("Hello from Sibling")
  }

}
