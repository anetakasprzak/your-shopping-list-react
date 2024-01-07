/* eslint react/prop-types: 0 */

import { useEffect, useState } from "react";

// const initialItems = [
//   {
//     id: 1,
//     description: "first item",
//     quantity: 4,
//     purchased: false,
//     deleted: false,
//   },
//   {
//     id: 2,
//     description: "second item",
//     quantity: 2,
//     purchased: true,
//     deleted: false,
//   },
//   {
//     id: 3,
//     description: "second item",
//     quantity: 2,
//     purchased: true,
//     deleted: true,
//   },
//   {
//     id: 4,
//     description: "second item",
//     quantity: 2,
//     purchased: true,
//     deleted: false,
//   },
//   {
//     id: 5,
//     description: "second item",
//     quantity: 2,
//     purchased: true,
//     deleted: false,
//   },
// ];

export default function App() {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem("items")) || []
  );

  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  }

  function handleMarkDeleted(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, deleted: !item.deleted } : item
      )
    );
  }

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  return (
    <div className="container">
      <Heading />
      <Form handleAddItem={handleAddItem} items={items} />
      <ShoppingList
        items={items}
        handleDeleteItem={handleDeleteItem}
        handleToggleItem={handleToggleItem}
      />

      <ItemsYouHave items={items} handleMarkDeleted={handleMarkDeleted} />
    </div>
  );
}

function Heading() {
  return <h1 className="heading">Your shopping list</h1>;
}

function Form({ handleAddItem, items }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    handleAddItem({
      id: items.length + 1,
      description,
      quantity,
      purchased: false,
    });

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input__box">
        <label>Item</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="input__box">
        <label>Quantity</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <button className="add__btn">ADD</button>
    </form>
  );
}

function ShoppingList({ items, handleDeleteItem, handleToggleItem }) {
  return (
    <div>
      {!items.length && <p>Start adding your items..</p>}
      <ul className="list">
        {items
          .filter((item) => !item.purchased)
          .map((item) => (
            <Item
              key={item.description}
              id={item.id}
              description={item.description}
              quantity={item.quantity}
              purchased={item.purchased}
              handleDeleteItem={handleDeleteItem}
              handleToggleItem={handleToggleItem}
            />
          ))}
      </ul>
    </div>
  );
}

function Item({
  description,
  quantity,
  purchased,
  handleDeleteItem,
  id,
  handleToggleItem,
}) {
  return (
    <li className="item">
      <input
        className="checkbox"
        type="checkbox"
        value={purchased}
        checked={purchased}
        onChange={() => handleToggleItem(id)}
      />
      {quantity} - {description}
      <button className="delete__btn" onClick={() => handleDeleteItem(id)}>
        Delete
      </button>
    </li>
  );
}

function ItemsYouHave({ items, handleMarkDeleted }) {
  const [itemsPurchased, setItemsPurchased] = useState([]);

  // const itemsPurchased = items?.filter((item) => item.purchased);

  useEffect(() => {
    setItemsPurchased(items?.filter((item) => item.purchased && !item.deleted));
  }, [items]);

  return (
    <div>
      {!itemsPurchased.length ? (
        ""
      ) : (
        <div className="clear__box">
          <h2>Items you have</h2>
        </div>
      )}

      {itemsPurchased.map((item) => (
        <div key={item.id} className="clear__box">
          <p>{item.description}</p>
          <button
            className="btn__bin"
            onClick={() => handleMarkDeleted(item.id)}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
