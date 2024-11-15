
type ItemType = 'common' | 'legendary' | 'cheese' | 'event' | 'conjured';

type QualityAdjustmentPolicy = (sellIn: number) => QualityAdjustment;
type QualityAdjustment = DeltaAdjustment | SetAdjustment | null;

interface DeltaAdjustment {
  change: number;
}

interface SetAdjustment {
  value: number;
}

function isDeltaAdjustment(adjustment: QualityAdjustment): adjustment is DeltaAdjustment {
  return adjustment !== null && 'change' in adjustment;
}

function isSetAdjustment(adjustment: QualityAdjustment): adjustment is SetAdjustment {
  return adjustment !== null && 'value' in adjustment;
}

function amplify(adjustment: QualityAdjustment, scale: number = 2) {
  if (isDeltaAdjustment(adjustment)) return { change: scale * adjustment.change };
  return adjustment;
}

const legendaryItemPolicy: QualityAdjustmentPolicy = (_sellIn) => null;
const commonItemPolicy: QualityAdjustmentPolicy = (_sellIn) => ({ change: -1 });
const conjuredItemPolicy: QualityAdjustmentPolicy = (_sellIn) => ({ change: -2 });
const cheeseItemPolicy: QualityAdjustmentPolicy = (_sellIn) => ({ change: 1 });
const eventItemPolicy: QualityAdjustmentPolicy = (sellIn) => {
  if (sellIn <= 0) return { value: 0 };
  if (sellIn <= 5) return { change: 3 };
  if (sellIn <= 10) return { change: 2 };

  return { change: 1 };
}

const ITEM_TYPE_POLICY: Record<ItemType, QualityAdjustmentPolicy> = {
  cheese: cheeseItemPolicy,
  common: commonItemPolicy,
  conjured: conjuredItemPolicy,
  event: eventItemPolicy,
  legendary: legendaryItemPolicy,
};

function classifyItem(name: string): ItemType {
  if (name.includes('Sulfuras')) return 'legendary';
  if (name.includes('Backstage pass')) return 'event';
  if (name.includes('Brie')) return 'cheese';
  if (name.includes('Conjured')) return 'conjured';

  return 'common';
}

export class Item {
  private itemType: ItemType;
  private policy: QualityAdjustmentPolicy;

  constructor(public name: string, protected _sellIn: number, protected _quality: number) {
    this.itemType = classifyItem(name);
    this.policy = ITEM_TYPE_POLICY[this.itemType];
  }

  get quality() { return this._quality; }
  get sellIn() { return this._sellIn; }

  protected set quality(value: number) {
    this._quality = Math.max(0, Math.min(value, 50));
  }

  protected set sellIn(value: number) {
    this._sellIn = value;
  }

  applyPolicy() {
    let adjustment = this.policy(this._sellIn);
    if (this.itemType !== 'legendary') this.sellIn--;
    if (this.sellIn < 0) adjustment = amplify(adjustment);

    if (isDeltaAdjustment(adjustment))
      this.quality += adjustment.change;
    else
    if (isSetAdjustment(adjustment))
      this.quality = adjustment.value;
  }
}

export class GildedRose {
  constructor(private items: Item[] = []) {
  }

  updateQuality() {
    for (const item of this.items) {
      item.applyPolicy();
      // if (item.name !== 'Aged Brie' && item.name !== 'Backstage passes to a TAFKAL80ETC concert') {
      //   if (item.quality > 0) {
      //     if (item.name !== 'Sulfuras, Hand of Ragnaros') {
      //       item.quality = item.quality - 1
      //     }
      //   }
      // } else {
      //   if (item.quality < 50) {
      //     item.quality = item.quality + 1
      //     if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
      //       if (item.sellIn < 11) {
      //         if (item.quality < 50) {
      //           item.quality = item.quality + 1
      //         }
      //       }
      //       if (item.sellIn < 6) {
      //         if (item.quality < 50) {
      //           item.quality = item.quality + 1
      //         }
      //       }
      //     }
      //   }
      // }
      // if (item.name !== 'Sulfuras, Hand of Ragnaros') {
      //   item.sellIn = item.sellIn - 1;
      // }
      // if (item.sellIn < 0) {
      //   if (item.name !== 'Aged Brie') {
      //     if (item.name !== 'Backstage passes to a TAFKAL80ETC concert') {
      //       if (item.quality > 0) {
      //         if (item.name !== 'Sulfuras, Hand of Ragnaros') {
      //           item.quality = item.quality - 1
      //         }
      //       }
      //     } else {
      //       item.quality = item.quality - item.quality
      //     }
      //   } else {
      //     if (item.quality < 50) {
      //       item.quality = item.quality + 1
      //     }
      //   }
      // }
    }

    return this.items;
  }
}
