'use strict';
document.addEventListener('DOMContentLoaded', function() {
	tabs()// табы текста
	checkboxes()// чекбоксы
	unitSelect()// селектор озвучки
	filters()// фильтры карточек
})

function tabs() {
	const tabs = document.querySelector('.nda__tabs')
	if (!tabs) return

	const selects = tabs.querySelectorAll('.unit-select')

	tabs.querySelectorAll('.nda__nav_item').forEach(tab => {
		tab.addEventListener('click', function (e) {
			e.preventDefault()

			const targetId = this.dataset.target

			document.querySelectorAll('.nda__content .nda__content_item').forEach(item => {
				item.classList.toggle('active', item.dataset.id === targetId)
			})

			tabs.querySelectorAll('.nda__nav_item').forEach(item => {
				item.classList.remove('active')
			})

			this.closest('.nda__nav_item').classList.add('active')

			// скрытие селектов
			selects.forEach(select => {
				select.hidden = select.dataset.for != targetId
			})
		})
	})
}

function checkboxes() { 
	document.addEventListener('click', function(e) { 
		if(e.target.closest('.unit-select_list_item')) { 
			e.stopPropagation() 
		} 
	}, true) 
}

function unitSelect() {
	const SELECTOR = {
		root: ".unit-select",
		text: ".unit-select_text",
		item: ".unit-select_list_item",
		input: ".unit-select_input",
	};

	const selects = document.querySelectorAll(SELECTOR.root);

	const closeAll = (except = null) => {
		selects.forEach(el => {
			if (el === except) return;
			el.classList.remove("_active");
			el.removeAttribute("data-focus");
		});
	};

	const setActiveItem = (item) => {
		const parent = item.closest(SELECTOR.root);

		// снять актив со всех
		parent.querySelectorAll(SELECTOR.item).forEach(el => {
			el.removeAttribute("data-active");
		});

		// поставить актив
		item.setAttribute("data-active", "");

		// обновить input
		const input = parent.querySelector(SELECTOR.input);
		if (input) input.value = item.dataset.val ?? "";

		// обновить текст
		const text = parent.querySelector(SELECTOR.text);
		if (text) {
			text.innerHTML = item.innerHTML;
			text.classList.add("_filled");
		}

		parent.classList.remove("_active");
	};

	document.body.addEventListener("click", (e) => {
		const text = e.target.closest(SELECTOR.text);
		if (text) {
			const parent = text.closest(SELECTOR.root);

			closeAll(parent);

			parent.classList.toggle("_active");
			parent.setAttribute("data-focus", "");
			return;
		}

		const item = e.target.closest(SELECTOR.item);
		if (item) {
			setActiveItem(item);
			return;
		}

		// клик вне
		closeAll();
	});

	// default-active
	const defaultItem = document.querySelector(`${SELECTOR.item}[default-active]`);
	if (defaultItem) {
		setTimeout(() => defaultItem.click(), 100);
	}
}

function filters() {
	const filters = document.querySelectorAll('.nda__filters')
	if(!filters) return

	// showmore
	filters.forEach(filter => {
		const filtersItems = filter.querySelectorAll('.nda__list_item.hidden')
		const filtersBtnMore = filter.querySelector('.show_more')

		if(!filtersBtnMore) return

		filtersBtnMore.addEventListener('click', () => {
		filtersItems.forEach(item => {
			item.classList.remove('hidden')
		})

		filtersBtnMore.classList.add('hidden')
		})
	})
	

	// sort
	document.addEventListener('click', function(e) {
		const clicked = e.target.closest('.nda__filters .nda__list_item')
		
		if(!clicked || clicked.classList.contains('show_more')) return

		const tabPane = clicked.closest('.nda__content')
		
		if(!tabPane) return

		const filterList= tabPane.querySelector('.nda__filters_list')
		const filtersItems = filterList.querySelectorAll('[data-filter]')
		const cards = tabPane.querySelectorAll('[data-category]')
		const filterValue = clicked.dataset.filter

		// toggle active filter
		clicked.classList.toggle('active')

		// collect all filters
		const activeFilters = Array.from(filtersItems).filter(item => item.classList.contains('active')).map(item => item.dataset.filter)


		// if not have active = show all
		if(activeFilters.length === 0) {
			cards.forEach(card => card.classList.remove('hidden'))
			return
		}

		// sort cards
		cards.forEach(card => {
			const category = card.dataset.category

			if(activeFilters.includes(category)) {
				card.classList.remove('hidden')
			} else {
				card.classList.add('hidden')
			}
		})

		console.log(cards)
	})
}
