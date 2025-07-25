import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CategoryForm = () => {
  const { error } = useSelector(state => state.category);

  useEffect(() => {
    if (error) {
      toast.error(error); // Error toast display
    }
  }, [error]);

  return (
    <div>
      {/* ...existing form code... */}
    </div>
  );
};

export default CategoryForm;