import { commands, ExtensionContext, listManager, workspace } from 'coc.nvim';
import PlugsList from './lists';

export async function activate(context: ExtensionContext): Promise<void> {
  workspace.showMessage(`coc-plugs works!`);

  context.subscriptions.push(
    commands.registerCommand('coc-plugs.Command', async () => {
      workspace.showMessage(`coc-plugs Commands works!`);
    }),

    listManager.registerList(new PlugsList(workspace.nvim)),

    workspace.registerKeymap(
      ['n'],
      'coc-plugs-keymap',
      async () => {
        workspace.showMessage(`registerKeymap`);
      },
      { sync: false }
    ),

    workspace.registerAutocmd({
      event: 'InsertLeave',
      request: true,
      callback: () => {
        workspace.showMessage(`registerAutocmd on InsertLeave`);
      },
    })
  );
}
