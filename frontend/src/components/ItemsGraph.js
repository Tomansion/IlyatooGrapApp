class Item {
  constructor(label, parent = null) {
    this.label = label;
    this.parent = parent;
    this.links = [];
  }

  addItemLink(itemLabel, linkLabel) {
    if (!itemLabel) {
      console.error("No item label provided");
      return;
    }

    if (!linkLabel) {
      console.error("No link label provided");
      return;
    }

    // Search if we already are not linked through the parent
    if (this.parent) {
      const parentLink = this.parent.links.find(
        (link) => link.itemTarget.label === itemLabel
      );
      if (parentLink) {
        console.log("Already in parent");
        return;
      }
    }

    // Search if we already have an item with the same label
    const existingItem = this.links.find(
      (link) => link.itemTarget.label === itemLabel
    );
    if (existingItem) {
      console.log("Already in links");
      return;
    }

    // Create the item and the link
    const itemTarget = new Item(itemLabel, this);
    this.links.push(new Link(itemTarget, linkLabel));
  }

  convertToVisData() {
    const nodes = [];
    const edges = [];

    // Add the current item
    nodes.push({ id: this.label, label: this.label });

    // Add the links
    this.links.forEach((link) => {
      nodes.push({ id: link.itemTarget.label, label: link.itemTarget.label });
      edges.push({ from: this.label, to: link.itemTarget.label });
    });

    // Add the parent
    if (this.parent) {
      nodes.push({ id: this.parent.label, label: this.parent.label });
      edges.push({ from: this.label, to: this.parent.label });
    }

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
  const item = new Item(label);

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

    item.addItemLink(linkItemTargetLabel, linkLabel);
  });

  return item;
};

export { convertToItemObjects, Item, Link };
