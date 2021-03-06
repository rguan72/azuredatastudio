/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadLanguagesShape, IMainContext } from '../common/extHost.protocol';
import * as vscode from 'vscode';
import { ExtHostDocuments } from 'vs/workbench/api/node/extHostDocuments';

export class ExtHostLanguages {

	private readonly _proxy: MainThreadLanguagesShape;
	private readonly _documents: ExtHostDocuments;

	constructor(
		mainContext: IMainContext,
		documents: ExtHostDocuments
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadLanguages);
		this._documents = documents;
	}

	getLanguages(): Promise<string[]> {
		return this._proxy.$getLanguages();
	}

	changeLanguage(uri: vscode.Uri, languageId: string): Promise<vscode.TextDocument | undefined> {
		return this._proxy.$changeLanguage(uri, languageId).then(() => {
			const data = this._documents.getDocumentData(uri);
			return data ? data.document : undefined;
		});
	}
}
