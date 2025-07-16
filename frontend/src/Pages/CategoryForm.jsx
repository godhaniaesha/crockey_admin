import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/d_style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  fetchCategories,
  updateCategory,
} from "../redux/slice/category.slice";
import { useEffect } from "react";

const CategoryForm = () => {
  const [form, setForm] = useState({
    categoryName: "",
    status: "Active",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    // If categories are not loaded, fetch them
    if (
      (!categories ||
        (Array.isArray(categories) && categories.length === 0) ||
        (Array.isArray(categories?.result) &&
          categories.result.length === 0)) &&
      id
    ) {
      dispatch(fetchCategories());
    }

    if (id && categories) {
      const cat = Array.isArray(categories?.result)
        ? categories.result.find((c) => c._id === id)
        : Array.isArray(categories)
        ? categories.find((c) => c._id === id)
        : null;
      if (cat) {
        setForm({
          categoryName: cat.name || "",
          status:
            cat.status === "Active" ||
            cat.status === true ||
            cat.status === 1 ||
            cat.active === true ||
            cat.active === "Active" ||
            cat.active === 1,
          description: cat.description || "",
        });
        if (cat.image) {
          setImages([
            { file: null, url: `http://localhost:5000/uploads/${cat.image}` },
          ]);
        } else {
          setImages([]);
        }
      }
    }
  }, [id, categories, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImages({
        file: e.dataTransfer.files[0],
        url: URL.createObjectURL(e.dataTransfer.files[0]),
      });
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.categoryName);
    formData.append("description", form.description);
    formData.append("status", form.status ? "Active" : "Inactive");
    if (images.length > 0 && images[0].file) {
      formData.append("image", images[0].file);
    }
    try {
      if (id) {
        await dispatch(updateCategory({ id, formData })).unwrap();
        alert("Category Updated!");
      } else {
        await dispatch(createCategory(formData)).unwrap();
        alert("Category Added!");
      }
      setForm({ categoryName: "", status: "Active", description: "" });
      setImages([]);
      dispatch(fetchCategories());
      navigate("/category/list"); // <-- navigate to the list page
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
      <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">
        Add New Category
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">
            Category Images
          </h3>
          <div
            className={`d_MP-dropzone flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
              dragActive
                ? "border-[#254D70] bg-[#e6eef5]"
                : "border-[#b6c6d7] bg-[#f8fafc]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleImageClick}
          >
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
            {images.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg shadow border border-[#254D70]/30"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 shadow group-hover:scale-110 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-[#254D70]/60 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm8-6l-2 2-2-2"
                  />
                </svg>
                <span className="text-[#254D70]/70 font-medium">
                  Drag & drop or click to upload (multiple allowed)
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">
            Category Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Category Name
              </label>
              <input
                type="text"
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                required
                placeholder="Enter Category Name"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Status
              </label>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#254D70] rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#254D70] relative"></div>
                </label>
                <span className="text-sm text-gray-700">
                  {form.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          {/* <h3 className="d_MP-section-title text-xl font-bold mb-4">Description</h3> */}
          <div className="mb-4">
            <label className="d_MP-label block mb-2 font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
              rows={3}
              required
              placeholder="Describe the Category"
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition"
          >
            {id ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
