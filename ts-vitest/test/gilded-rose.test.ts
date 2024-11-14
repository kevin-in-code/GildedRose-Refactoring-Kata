import { assert, describe, expect, it, test } from 'vitest';

import {Shop, Item} from "../src/gilded-rose";

describe("Gilded Rose", function() {
  it("should foo", function() {
    const gildedRose = new Shop([new Item("foo", 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe("fixme");
  });
});
