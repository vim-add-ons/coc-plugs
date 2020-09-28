import { BasicList, ListAction, ListContext, ListItem, Neovim, workspace } from 'coc.nvim';

export default class PlugsList extends BasicList {
  public readonly name = 'plugs_list';
  public readonly description = 'CocList for coc-plugs';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim) {
    super(nvim);

    this.addAction('open', async(item: ListItem) => {
        let { state, key, nvim } = item.data
        //nvim.workspace.showMessage(`${item.label} , ${item.data.nvim}`)
        //nvim.workspace.showMessage(`${item.label}, ${modules.data.name}`)
        if (Array.isArray(item))
            return;

        let ctype = await nvim.eval("v:ctype")
        let lang = await nvim.eval("v:lang")
        await nvim.command("language mes C",true)
        await nvim.command("language ctype C",false)
        let res = await nvim.eval(`split(execute("verbose ${state}map ${key}"),"\n")[-1]`);
        await nvim.command(`echom '2: ${res} ${state} ${key}'`,true);
        await nvim.command("language mes " + lang,true)
        await nvim.command("language ctype " + ctype,true)
        if (/Last\sset\sfrom/.test(res)) {
            let ongoing = res.replace(/^\s+Last\sset\sfrom\s+/, '')
            let filepath = ongoing.replace(/ line \d*$/, '')
            let linenr = ongoing.replace(/^.*line /,'')
            await nvim.command(`edit +:${linenr} ${filepath}`, true)
        }
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
      let { nvim } = this;
      const regex = /^(\S+)\s+(\S+)\s+(.*)$/;
      let state = '';
      for (let arg of context.args) {
          if (arg.startsWith('-state=')) {
              state = arg.replace('-state=', '');
          }
      }
      let list = await nvim.eval(`split(execute("verbose ${state}map"),"\n")`);

      await nvim.command(`echom '${list[1]}'`,true);
      let res : ListItem[] = [];
      for (let idx=0; idx<10; idx++) {
          let line = list[idx]
          let ms = line.match(regex);
          if (ms) {
              //let colors = my_require(3)
              let [, state, key, more] = ms;
              let item : ListItem = {
                  //label: ` ${colors.magenta(state)}\t${colors.blue(key)}\t${more}`,
                  label: ` ${state}\t${key}\t${more}`,
                  filterText: `${key} ${more}`,
                  data: {
                      state,
                      key,
                      nvim
                  }
              }
              res.push(item);
          } else {
          }
      }
      return res;
  }
}
