// The drag and drop part.

export const dragDrop = () => {
  const $ul = document.querySelector('.ul');

  $ul.addEventListener('dragstart', e => {
    e.target.classList.add('ul__li--dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.task);
  });

  $ul.addEventListener('dragend', e => e.target.classList.remove('ul__li--dragging'));

  $ul.addEventListener('dragover', e => {
    e.preventDefault();
    if (!e.target.matches('.ul__li--dragging') && !e.target.matches('.ul__li--dragging *') && !e.target.matches('.ul__li--last-child') && !e.target.matches('.ul__li--last-child *')) e.target.classList.add('ul__li--dropping');
  });

  $ul.addEventListener('drop', e => {
    e.preventDefault();
    e.target.classList.remove('ul__li--dropping');

    const dragElementId = e.dataTransfer.getData('text/plain');
    const dragElement = document.querySelector(`[data-task="${dragElementId}"]`);

    if (!e.target.matches('.ul') && !e.target.matches(`[data-task="${dragElementId}"]`) && !e.target.matches('.ul__li--last-child')) {
      e.target.matches('.ul__li:first-of-type') ? e.target.before(dragElement) : e.target.after(dragElement);
    }
  });

  $ul.addEventListener('dragleave', e => e.target.classList.remove('ul__li--dropping'));

  $ul.addEventListener('dragleave', e => e.target.classList.remove('ul__li--dropppingm'));
};
