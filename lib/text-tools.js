'use babel';

import {
	CompositeDisposable
} from 'atom';

export default {

	subscriptions: null,

	activate(state) {

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'text-tools:reverseText': () => this.reverseText(),
			'text-tools:base64Encode': () => this.base64Encode(),
			'text-tools:base64Decode': () => this.base64Decode(),
			'text-tools:sortLines': () => this.sortLines(),
			'text-tools:natSortLines': () => this.natSortLines(),
			'text-tools:sortLinesByLength': () => this.sortLinesByLength(),
			'text-tools:reverseLines': () => this.reverseLines(),
			'text-tools:removeDupLines': () => this.removeDupLines(),
			'text-tools:unescapeJson': () => this.unescapeJson(),
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	serialize() {
		return {};
	},

	reverseText() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let reversed = selection.split('').reverse().join('');
			editor.insertText(reversed);
		}
	},

	sortLines() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let sorted = selection.split(/\r?\n/);
			sorted.sort((a, b) => a.localeCompare(b));
			let le = editor.getBuffer().getPreferredLineEnding();
			le = le === null ? '\n' : le;
			editor.insertText(sorted.join(le));
		}
	},

	sortLinesByLength() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let sorted = selection.split(/\r?\n/);
			sorted.sort((a, b) => a.length - b.length);
			let le = editor.getBuffer().getPreferredLineEnding();
			le = le === null ? '\n' : le;
			editor.insertText(sorted.join(le));
		}
	},

	natSortLines() {
		let editor;

		function natsortconv(s) {
			return (' ' + s + ' ').replace(/[\s]+/g, ' ').toLowerCase().replace(/[\d]+/, function(d) {
				d = '' + 1e20 + d;
				return d.substring(d.length - 20);
			});
		}

		function natsort(a, b) {
			return natsortconv(a).localeCompare(natsortconv(b));
		}

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let sorted = selection.split(/\r?\n/);
			sorted.sort(natsort);
			let le = editor.getBuffer().getPreferredLineEnding();
			le = le === null ? '\n' : le;
			editor.insertText(sorted.join(le));
		}
	},

	reverseLines() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let reversed = selection.split(/\r?\n/).reverse();
			let le = editor.getBuffer().getPreferredLineEnding();
			le = le === null ? '\n' : le;
			editor.insertText(reversed.join(le));
		}
	},

	removeDupLines() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			let selection = editor.getSelectedText();
			let set = new Set(selection.split(/\r?\n/));

			let le = editor.getBuffer().getPreferredLineEnding();
			le = le === null ? '\n' : le;

			editor.insertText(Array.from(set).join(le));
		}
	},

	base64Encode() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			editor.insertText(btoa(editor.getSelectedText()));
		}
	},

	base64Decode() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			editor.insertText(atob(editor.getSelectedText()));
		}
	},

	unescapeJson() {
		let editor;

		if (editor = atom.workspace.getActiveTextEditor()) {
			try {
				var z = JSON.parse(editor.getSelectedText());
				if (typeof z === 'string') {
					editor.insertText(z);
				}
			} catch (e) {}
		}
	},
};
