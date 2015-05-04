import fragment from '../util/fragment';

export default {
  value: function (where, html) {
    var frag = fragment.fromString(html);

    if (where === 'beforebegin') {
      this.parentNode.insertBefore(frag, this);
    } else if (where === 'afterbegin') {
      this.insertBefore(frag, this.childNodes[0]);
    } else if (where === 'beforeend') {
      this.appendChild(frag);
    } else if (where === 'afterend') {
      this.parentNode.insertBefore(frag, this.nextSibling);
    }

    return this;
  }
};
