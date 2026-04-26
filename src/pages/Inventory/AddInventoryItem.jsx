import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import "../../styles/FormPage.css";

const AddInventoryItem = () => {
  const [inventoryItem, setInventoryItem] = useState({
    type: "CONSUMABLE",
    categoryId: "",
    departmentId: "",
    itemId: "", // ✅ added to track selected item
    unit: "",
    totalQuantity: "",
    minimumQuantity: "",
    description: "",
  });

  const [items, setItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const { departmentId, categoryId } = inventoryItem;

    if (departmentId) {
      fetchCategoriesByDepartment(departmentId); // 👈 fetch categories by department
      setInventoryItem((prev) => ({ ...prev, categoryId: "", itemId: "" })); // reset below dropdowns
      setItems([]); // clear items
    } else {
      setCategories([]); // clear categories if no department selected
      setItems([]);
    }
  }, [inventoryItem.departmentId]);

  useEffect(() => {
    const { departmentId, categoryId } = inventoryItem;

    if (departmentId && categoryId) {
      fetchItemsByDepAndCat(departmentId, categoryId);
    } else {
      setItems([]);
    }
  }, [inventoryItem.categoryId]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const res = await axiosInstance.get("/departments/all");
      setDepartments(res.data);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchCategoriesByDepartment = async (depId) => {
    try {
      setLoadingCategories(true);
      const res = await axiosInstance.get(`/categories/department/${depId}`);
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoadingCategories(false); // ✅ always stop loading
    }
  };

  const fetchItemsByDepAndCat = async (depId, catId) => {
    try {
      setLoadingItems(true);
      const res = await axiosInstance.get(
        `/items/department/${depId}/category/${catId}`,
      );
      setItems(res.data);
    } catch (error) {
      toast.error("No items found for selected department and category");
      setItems([]);
    } finally {
      setLoadingItems(false); // ✅ always stop loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Reset dependent dropdowns on department change
    if (name === "departmentId") {
      setInventoryItem((prev) => ({
        ...prev,
        departmentId: value,
        categoryId: "", // reset category
        itemId: "", // reset item
      }));
      setCategories([]); // clear old categories
      setItems([]); // clear old items
      return;
    }

    // ✅ Reset item on category change
    if (name === "categoryId") {
      setInventoryItem((prev) => ({
        ...prev,
        categoryId: value,
        itemId: "", // reset item
      }));
      setItems([]); // clear old items
      return;
    }

    setInventoryItem((prev) => ({ ...prev, [name]: value }));

    if (name === "itemId") {
      const selectedItem = items.find((item) => item.id === Number(value));
      setInventoryItem((prev) => ({
        ...prev,
        itemId: value,
        unit: selectedItem?.unit || "", // ✅ auto fill unit
        type: selectedItem?.type || "CONSUMABLE", // ✅ auto fill type
      }));
      return;
    }
  };

  // ✅ Add item to local list (no API call yet)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { field: "itemId", label: "Item Name" },
      { field: "categoryId", label: "Category" },
      { field: "totalQuantity", label: "Quantity" },
      { field: "departmentId", label: "Department" },
    ];

    for (let { field, label } of requiredFields) {
      if (!inventoryItem[field]) {
        toast.error(`${label} is required`);
        return;
      }
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(inventoryItem.categoryId),
    );

    const selectedDepartment = departments.find(
      (dep) => dep.id === Number(inventoryItem.departmentId),
    );

    const selectedItem = items.find(
      (item) => item.id === Number(inventoryItem.itemId),
    );

    // ✅ Build the formatted data to send to backend
    const formattedData = {
      item: {
        id: Number(inventoryItem.itemId),
        name: selectedItem?.name,
      },
      type: inventoryItem.type,
      description: inventoryItem.description,
      unit: inventoryItem.unit,
      totalQuantity: Number(inventoryItem.totalQuantity),
      availableQuantity: Number(inventoryItem.totalQuantity), // initially same as total
      minimumQuantity: Number(inventoryItem.minimumQuantity),
      category: {
        id: Number(inventoryItem.categoryId),
        name: selectedCategory?.name,
      },
      department: {
        id: Number(inventoryItem.departmentId),
        name: selectedDepartment?.name,
      },
    };

    // ✅ Add to local list, don't submit yet
    setAddedItems((prev) => [...prev, formattedData]);
    toast.success("Item added to list!");

    // ✅ Reset form
    setInventoryItem({
      type: "CONSUMABLE",
      categoryId: "",
      departmentId: "",
      itemId: "",
      unit: "",
      totalQuantity: "",
      minimumQuantity: "",
      description: "",
    });
    setItems([]); // clear items dropdown after reset
  };



  const handleSubmitAll = async () => {
    if (addedItems.length === 0) {
      toast.error("Add at least one item.");
      return;
    }

    try {
      setLoading(true);

      for (let i = 0; i < addedItems.length; i++) {
        // ✅ Force correct structure before sending
        const payload = {
          itemId: {
            id: addedItems[i].item?.id || addedItems[i].itemId?.id,
          },
          totalQuantity: addedItems[i].totalQuantity,
          availableQuantity: addedItems[i].availableQuantity,
          minimumQuantity: addedItems[i].minimumQuantity,
        };

        console.log("Sending payload:", payload); // 👈 check this in console

        await axiosInstance.post("/inventory-items/add", payload);
      }

      toast.success("All Inventory Items submitted successfully!");
      setAddedItems([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit Inventory Items.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="requirement-container">
        <h2>Add Inventory Items</h2>

        <form onSubmit={handleSubmit} className="requirement-form">
          <div className="form-grid-container">
            {/* Department */}
            <div className="form-input">
              <label>
                Department <span className="mandatory">*</span>
              </label>
              <select
                name="departmentId"
                value={inventoryItem.departmentId}
                onChange={handleChange}
                disabled={loadingDepartments} // 👈
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..." // 👈
                    : departments.length === 0
                      ? "No departments found"
                      : "Select Department"}
                </option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
             
            </div>

            {/* Category */}
            <div className="form-input">
              <label>
                Item Category <span className="mandatory">*</span>
              </label>
              <select
                name="categoryId"
                value={inventoryItem.categoryId}
                onChange={handleChange}
                disabled={!inventoryItem.departmentId || loadingCategories} // 👈
              >
                <option value="">
                  {!inventoryItem.departmentId
                    ? "Select Department first"
                    : loadingCategories
                      ? "Loading categories..." // 👈 loading hint
                      : categories.length === 0
                        ? "No categories found"
                        : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              
            </div>

            {/* Item Name  */}
            <div className="form-input">
              <label>
                Item Name <span className="mandatory">*</span>
              </label>
              <select
                name="itemId"
                value={inventoryItem.itemId}
                onChange={handleChange}
                disabled={!inventoryItem.categoryId || loadingItems}
              >
                <option value="">
                  {!inventoryItem.departmentId
                    ? "Select Department first"
                    : !inventoryItem.categoryId
                      ? "Select Category first"
                      : loadingItems
                        ? "Loading items..."
                        : items.length === 0
                          ? "No items found"
                          : "Select Item"}
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {inventoryItem.itemId &&
              (() => {
                const selectedItem = items.find(
                  (item) => item.id === Number(inventoryItem.itemId),
                );
                return selectedItem ? (
                  <>
                    <div className="form-input">
                      <label>Item Type</label>
                      <input
                        type="text"
                        value={selectedItem.type || ""}
                        readOnly
                        style={{
                          backgroundColor: "#f0f4ff",
                          cursor: "not-allowed",
                        }}
                      />
                    </div>

                    <div className="form-input">
                      <label>Item Unit</label>
                      <input
                        type="text"
                        value={selectedItem.unit || ""}
                        readOnly
                        style={{
                          backgroundColor: "#f0f4ff",
                          cursor: "not-allowed",
                        }}
                      />
                    </div>
                  </>
                ) : null;
              })()}

            {/* Total Quantity */}
            <div className="form-input">
              <label>
                Total Quantity <span className="mandatory">*</span>
              </label>
              <input
                type="number"
                name="totalQuantity"
                value={inventoryItem.totalQuantity}
                onChange={handleChange}
                min="1"
              />
            </div>

            {/* Minimum Quantity */}
            <div className="form-input">
              <label>Minimum Quantity</label>
              <input
                type="number"
                name="minimumQuantity"
                value={inventoryItem.minimumQuantity}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>

          {/* ✅ Added Items Table */}
          {addedItems.length > 0 && (
            <>
              <hr />
              <h3>Added Items ({addedItems.length})</h3>

              <table className="bulk-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {addedItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.department?.name}</td>
                      <td>{item.category?.name}</td>
                      <td>{item.item?.name}</td>
                      <td>{item.totalQuantity}</td>
                      <td>
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={() =>
                            setAddedItems(
                              addedItems.filter((_, i) => i !== index),
                            )
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                className="add-btn"
                disabled={loading}
                onClick={handleSubmitAll}
              >
                {loading ? "Submitting..." : "Submit All Items"}
              </button>
            </>
          )}

          <Link to="/app/items-list" className="back-link" >
            Back to Inventory Items
          </Link>
        </form>
      </div>
    </>
  );
};

export default AddInventoryItem;