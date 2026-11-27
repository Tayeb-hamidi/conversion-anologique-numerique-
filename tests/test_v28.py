"""Playwright test for isolated V28 candidate, no remote access."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def main():
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,args=['--no-sandbox'])
  page=b.new_page(viewport={'width':1440,'height':900})
  errors=[]; remote=[]
  page.on('pageerror',lambda e: errors.append(str(e)))
  page.on('request',lambda r: remote.append(r.url) if r.url.startswith(('http://','https://')) else None)
  page.route('http://**/*',lambda r:r.abort());page.route('https://**/*',lambda r:r.abort())
  page.goto((ROOT/'v28-prototype.html').as_uri())
  assert page.locator('.v28-panel').count()==7
  assert page.locator('math mfrac').count()>0
  page.locator('#v28-size').fill('22')
  assert page.locator('body').evaluate("(e)=>getComputedStyle(e).fontSize")=='22px'
  page.locator('#v28-spaced').check()
  assert page.locator('body').evaluate("(e)=>e.classList.contains('v28-spaced')")
  page.evaluate("location.hash='c03'")
  panel=page.locator('#c03 .v28-panel')
  panel.get_by_role('button',name='Préparer mon bilan').click()
  assert panel.locator('textarea').count()==5
  panel.get_by_role('button',name='Terminer le bilan local').click()
  assert 'Réponds à toutes' in panel.locator('.v28-status').inner_text()
  row=panel.locator('fieldset').first
  row.get_by_role('button',name='Formule mathématique').click()
  row.get_by_role('textbox',name='Premier terme').fill('2')
  row.get_by_role('textbox',name='Second terme').fill('4')
  row.get_by_role('button',name='Insérer la formule').click()
  assert 'frac' in row.locator('textarea').input_value()
  row.get_by_role('slider',name='Curseur A').fill('2')
  row.get_by_role('button',name='Insérer les relevés dans ma réponse').click()
  assert 'Pression' in row.locator('textarea').input_value()
  for i,t in enumerate(panel.locator('textarea').all()):
   t.fill('Réponse de test '+str(i))
  panel.get_by_role('button',name='Terminer le bilan local').click()
  assert 'maîtrise non évaluée' in panel.locator('.v28-status').inner_text()
  page.reload()
  assert panel.locator('textarea').first.input_value()=='Réponse de test 0'
  assert not errors,errors
  assert not remote,remote
  mobile=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  mobile.goto((ROOT/'v28-prototype.html').as_uri())
  assert mobile.locator('.v28-panel').count()==7
  b.close()
  print('V28: sept bilans, MathML, taille/espacement, 5 questions, formulaire, courbe, sauvegarde/restauration, aucune erreur JS/requête distante : OK')
if __name__=='__main__':main()
