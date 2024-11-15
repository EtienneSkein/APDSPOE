import React from "react";

const postEdit = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Post</h2>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input type="text" className="form-control" placeholder="Edit title" />
        </div>
        <div className="form-group">
          <label>Caption</label>
          <textarea className="form-control" rows="3" placeholder="Edit your caption here"></textarea>
        </div>
        <div className="form-group">
          <label>Upload New Image</label>
          <input type="file" className="form-control-file" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
      </form>
    </div>
  );
};

export default postEdit;
