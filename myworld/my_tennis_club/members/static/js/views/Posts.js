import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  construtor () {
    this.setTitle("Dashboard");
  }

  async getHtml() {
    return `
          <h1>Posts</h1>
      <p>
          YOU ARE VIEWING POSTSSS. Reprehenderit anim fugiat sint exercitation consequat. Sit anim laborum sit amet Lorem adipisicing ullamco duis. Anim in do magna ea pariatur et.
      </p>
      <p>
          <a href="/posts" data-link>View recent posts</a>.
      </p>
    `;
  }
}