import {describe,it,expect} from 'vitest';
import {observationFromSelection} from '../../shared/observation';
import {createRecordRepository,recordCounts,type LocalRecord} from '../../shared/records';
import type {Prediction} from '../../shared/environment';
const prediction:Prediction={category:'agricultural_waste',certainty:'likely',summary:'Leaves',observations:['Dry leaves']};
const base={id:'live_1',createdAt:'2026-11-12T08:00:00Z',category:'agricultural_waste' as const,confirmed:true,prediction,location:'  Bertam  ',note:'  Garden leaves  '};
describe('functional scan to personal record',()=>{
 it('saves an accepted AI suggestion with provenance and trimmed fields',()=>{expect(observationFromSelection(base)).toMatchObject({source:'ai',aiCategory:'agricultural_waste',aiCertainty:'likely',location:'Bertam',note:'Garden leaves'});});
 it('preserves original AI provenance when the user corrects a category',()=>{expect(observationFromSelection({...base,category:'domestic_waste'})).toMatchObject({source:'user',category:'domestic_waste',aiCategory:'agricultural_waste',aiCertainty:'likely'});});
 it('does not promote uncertain predictions into accepted AI records',()=>{const uncertain:Prediction={category:'unknown',certainty:'uncertain',summary:'Unclear',observations:['Blurred']};expect(observationFromSelection({...base,prediction:uncertain})).toMatchObject({source:'user',aiCategory:'unknown',aiCertainty:'uncertain'});});
 it('saves manual observations without inventing AI evidence',()=>{expect(observationFromSelection({...base,prediction:null})).toMatchObject({source:'user',aiCategory:null,aiCertainty:null});});
 it('blocks unconfirmed and unknown selections',()=>{expect(()=>observationFromSelection({...base,confirmed:false})).toThrow('confirmation_required');expect(()=>observationFromSelection({...base,category:'unknown'})).toThrow('confirmation_required');});
 it('updates totals after durable save, reload and deletion',async()=>{let data:string|null=null;const storage={getItem:async()=>data,setItem:async(_key:string,value:string)=>{data=value;}};const repo=createRecordRepository(storage);await repo.add(observationFromSelection(base));await repo.add(observationFromSelection({...base,id:'manual_2',category:'domestic_waste',prediction:null}));const reloaded=createRecordRepository(storage);expect(recordCounts(await reloaded.load())).toMatchObject({total:2,aiAccepted:1,manual:1,withLocation:2});expect(recordCounts(await reloaded.remove('live_1'))).toMatchObject({total:1,aiAccepted:0,manual:1});});
 it('does not store image data, generated prose or simulated agency status',()=>{const record=observationFromSelection(base) as LocalRecord;expect(Object.keys(record).sort()).toEqual(['id','createdAt','category','source','aiCategory','aiCertainty','location','note'].sort());});
});
