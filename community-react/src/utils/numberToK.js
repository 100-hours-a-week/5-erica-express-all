export function viewToK(view) {
  let postView = "";
  if (view >= 1000000) {
    postView = "100K";
  } else if (view >= 10000) {
    postView = "10K";
  } else if (view >= 1000) {
    postView = "1K";
  } else {
    postView = view;
  }
  return postView;
}

export function commentToK(count) {
  let postCommentCount = "";
  if (count >= 1000) {
    postCommentCount = "1K";
  } else if (count >= 10000) {
    postCommentCount = "10K";
  } else if (count >= 1000000) {
    postCommentCount = "100K";
  } else {
    postCommentCount = count;
  }
  return postCommentCount;
}
