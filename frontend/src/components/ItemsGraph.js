const itemsMemory = {};

class Item {
  constructor(label, parent = null) {
    this.label = label;
    this.parent = parent;
    this.links = [];
  }

  addLinks(items) {
    items.forEach((itemLink) => {
      const linkLabel = itemLink.fkAction.id;

      const possibleTypes = [
        "fkSujetObjet",
        "fkSujetPersonne",
        "fkSujetAction",
        "fkSujetFrancais",
      ];

      let linkItemTargetLabel = null;
      for (let type of possibleTypes) {
        if (type in itemLink) {
          linkItemTargetLabel = itemLink[type].id;
          break;
        }
        if (!itemsMemory[label]) itemsMemory[label] = item;
      }

      if (!linkItemTargetLabel) {
        console.error("No link item target label found");
        console.error(itemLink);
        return;
      }

      item.addItemLink(linkItemTargetLabel, linkLabel);
    });
  }

  addItemLink(item, linkLabel) {
    if (!item) {
      console.error("No item provided");
      return;
    }

    if (!linkLabel) {
      console.error("No link label provided");
      return;
    }

    // Search if we already are not linked through the parent
    if (this.parent) {
      const parentLink = this.parent.links.find(
        (link) => link.itemTarget.label === item.label
      );
      if (parentLink) {
        console.log("Already in parent");
        return;
      }
    }

    // Search if we already have an item with the same label
    const existingItem = this.links.find(
      (link) => link.itemTarget.label === item.label
    );
    if (existingItem) {
      console.log("Already in links");
      return;
    }

    item.parent = this;
    this.links.push(new Link(item, linkLabel));
  }

  convertToVisData() {
    const nodes = [];
    const edges = [];

    // Add the current item
    if (!this.parent) nodes.push({ id: this.label, label: this.label });

    // Add the links
    this.links.forEach((link) => {
      nodes.push({ id: link.itemTarget.label, label: link.itemTarget.label });
      edges.push({
        from: this.label,
        to: link.itemTarget.label,
        label: link.linkLabel,
      });
    });

    return { nodes, edges };
  }
}

class Link {
  constructor(itemTarget, linkLabel) {
    this.itemTarget = itemTarget;
    this.linkLabel = linkLabel;
  }
}

const convertToItemObjects = (label, items) => {
  // Create the initial item
  let item = new Item(label);
  if (!item) {
    item = new Item(label);
    itemsMemory[label] = item;
  }

  // Add the links
  items.forEach((itemLink) => {
    const linkLabel = itemLink.fkAction.id;

    const possibleTypes = [
      "fkSujetObjet",
      "fkSujetPersonne",
      "fkSujetAction",
      "fkSujetFrancais",
    ];

    let linkItemTargetLabel = null;
    for (let type of possibleTypes) {
      if (type in itemLink) {
        linkItemTargetLabel = itemLink[type].id;
        break;
      }
    }

    if (!linkItemTargetLabel) {
      console.error("No link item target label found");
      console.error(itemLink);
      return;
    }

    // Create the item and the link
    let itemTarget = itemsMemory[linkItemTargetLabel];
    if (!itemTarget) {
      itemTarget = new Item(linkItemTargetLabel);
      itemsMemory[linkItemTargetLabel] = itemTarget;
    }

    item.addItemLink(itemTarget, linkLabel);
  });

  return item;
};

export { convertToItemObjects, itemsMemory, Item, Link };
