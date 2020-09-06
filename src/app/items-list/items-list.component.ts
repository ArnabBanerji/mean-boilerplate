import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from '../services/item/item.service';
import {Item} from '../../dto/item';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {


  items: Item[] = [];

  envStr = '';

  constructor(private itemService: ItemService) {
    this.envStr = 'ItemsList [Any]';
  }

  updateItems(isInit: boolean): void {
    this.itemService.getItems(isInit).subscribe(items => {
      this.items = items;
      console.log(this.envStr, `Got Items`, this.items.length);
    });
  }

  ngOnInit(): void {
    this.updateItems(true);
  }

}
