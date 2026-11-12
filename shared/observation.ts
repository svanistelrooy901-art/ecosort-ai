import {selectCategory, type IssueCategory, type Prediction} from './environment';
import {parseRecord} from './records';
/** Live/manual path only: demo fixtures are never accepted as predictions here. */
export function observationFromSelection(input: {id:string; createdAt:string; category:IssueCategory; confirmed:boolean; prediction:Prediction|null; location:string; note:string}) {
 if(!input.confirmed || input.category==='unknown')throw new Error('confirmation_required');
 const selected=selectCategory(input.prediction,input.category,true);
 return parseRecord({id:input.id,createdAt:input.createdAt,category:input.category,source:selected.source,aiCategory:input.prediction?.category??null,aiCertainty:input.prediction?.certainty??null,location:input.location.trim(),note:input.note.trim()});
}
