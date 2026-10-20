import {Image,Text,View} from 'react-native';
import {router} from 'expo-router';
import {Screen,Card,Button,Icon,s,colors} from '../components/ui';
import {useSession} from '../lib/session';
import {catalog} from '../../shared/catalog';
export default function Result(){const {result,photo}=useSession();if(!result)return <Screen title="Hasil analisis"><Text style={s.heading}>Belum ada hasil imbasan</Text><Text style={s.body}>Ambil foto bahan untuk memulakan analisis AI.</Text><Button title="Mula Scan" icon="camera" onPress={()=>router.replace('/camera')}/></Screen>;
 const advice=catalog[result.kind];return <Screen title="Hasil analisis">{photo?<Image source={{uri:photo.uri}} style={{height:240,width:'100%',borderRadius:24}} resizeMode="cover"/>:null}
 <View style={s.pill}><Text style={s.pillText}>{result.certainty==='uncertain'?'Perlu semakan lanjut':'Cadangan AI · belum disahkan'}</Text></View><Text style={s.heading}>{result.material}</Text><Text style={s.eyebrow}>{advice.category.toUpperCase()}</Text><Text style={s.body}>{result.reason}</Text>
 <Card><View style={s.row}><Icon name="recycle" size={30}/><Text style={[s.subheading,{flex:1}]}>{advice.title}</Text></View>{advice.steps.map((step,i)=><View key={step} style={[s.row,{alignItems:'flex-start'}]}><Text style={[s.subheading,{color:colors.green}]}>{i+1}.</Text><Text style={[s.body,{flex:1}]}>{step}</Text></View>)}</Card>
 <Card style={{backgroundColor:colors.pale}}><Text style={s.subheading}>Kenapa ini membantu?</Text><Text style={s.body}>{advice.benefit}</Text></Card>
 <Card style={s.warning}><View style={s.row}><Icon name="fire-off" color={colors.red}/><Text style={[s.subheading,{color:colors.red,flex:1}]}>Elakkan pembakaran terbuka</Text></View><Text style={s.body}>{advice.warning}</Text></Card>
 <Button title="Baca panduan berkaitan" secondary icon="book-open-page-variant" onPress={()=>router.push({pathname:'/education',params:{topic:advice.topic}})}/><Button title="Imbas bahan lain" icon="camera" onPress={()=>router.replace('/camera')}/><Text style={s.small}>Pengecaman berdasarkan rupa sahaja. Semak label bahan dan penerimaan pusat tempatan sebelum bertindak.</Text></Screen>;}
