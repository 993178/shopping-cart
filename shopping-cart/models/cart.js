// Discount Jonas (die ik misschien niet zo zou moeten noemen, hmmm...) wil de winkelwagen niet in de sessie opslaan om voor later te bewaren, dus gebruikt ie geen mongoose model.

module.exports = function Cart(oldCart) {     // oldCart is het winkelwagentje so far. (Bij eerste sessie is oldCart een leeg object, zie index.js)
    this.items = oldCart.items || {};     // wou ie eerst een array van maken, toen liever een object, en toen werd het dit. Maar het is dus een object, met, denk ik, daarin steeds de product id als key en weer een object als value.
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;  // dus || is... een soort ternary operator die checkt of iets bestaat. Ja: prima. Undefined > gebruik 0.

    this.add = function(item, id) {         // dus hier komt een nieuw item met id binnen
        var storedItem = this.items[id];    // en die slaan we op als storedItem
        if (!storedItem) {                  // bestaat storedItem niet al?
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};   // eerste stuk vat ik niet; nieuw item is een object met naam, aantal en prijs
        }
        storedItem.qty++;                   // eentje erbij tov die 0 in het nieuw toegevoegde product (en zelf aanpassen in het winkelwagentje?)
        storedItem.price = storedItem.item.price * storedItem.qty;  // direct prijs maal aantal - is dat slim
        this.totalQty++;
        this.totalPrice += storedItem.item.price;   // met item ertussen, anders is dat oude bedrag ook al vermenigvuldigd met het aantal
    }

    this.generateArray = function() {   // en hier wil hij een array maken van de items, maar ik kan niet volgen wat het daarvoor dan was!
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};
// wat ie probeert te doen, is een winkelwagentje creëren dat bij toevoeging van een product zichzelf opnieuw creëert met dat nieuwe product, zodat dubbele items gegroepeerd worden en je dus '2 brood, melk, suiker, eieren' te zien krijgt en niet 'brood, melk, suiker, brood, eieren'

// (tip bij dev problems: Ctrl+Shift+J > Resources > Cookies > delete connect-dinges cookie. Anders onthoudt ie de sessie waarbij er dingen niet klopten (NaN enzo))