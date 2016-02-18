<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?>
<script>
	var countES = 0 ; 
	var countIS = 0 ; 
	var countSD = 0 ; 
	var countRD = 0 ; 
	var isDisplayES = 0 ; 
	var isDisplayIS = 0 ; 
	var isDisplaySD = 0 ; 
	var isDisplayRD = 0 ; 
	
	$(function(){
		$('table#tShowStopDetail').hide();
		$('div#shiftlyReportDetail').hide();
	});
	
	function viewShiftlyReport(){
		$('table#tShowStopDetail').show();
		$('table#tShowStopDetail').slideDown();
	}
	
	function openExternalStop()
	{
		countES += 1 ; 
		if(countES%2==0){ // close
			$('#openES').html("Open External Stop");
			isDisplayES = 0 ; 
			// lakukan penutupan
			$('"#externalStopDetail"').html(); // kosongkan halaman
		}else{ // open 
			$('#openES').html("Close External Stop");
			isDisplayES = 1 ; 
			var data = {
				date : $('input[name="tanggal1"]').val(),
				typeMachine : $('select[name="typeMachine"]').val(),
				machineLine : $('select[name="cmbSectionMachine"]').val(),
				shift : $("#shift").val() 
			}
			ajaxLoadPage(data,"html","SecondaryGempolReport/getExternalStop","#externalStopDetail");
		}
		showHideDetail();
	}
	
	function openInternalStop()
	{
		countIS += 1;
		if(countIS%2==0){// open 
			$('#openIS').html("Open Internal Stop");
			isDisplayIS = 0 ; 
		}else{// close
			$('#openIS').html("Close Internal Stop");
			isDisplayIS = 1 ; 
		}
		showHideDetail();
	}
	
	function openStopDetail()
	{
		countSD += 1;
		if(countSD%2==0){// open 
			$('#openSD').html("Open Stop Detail");
			isDisplaySD = 0 ; 
		}else{// close
			$('#openSD').html("Close Stop Detail");
			isDisplaySD = 1 ; 
		}
		showHideDetail();
	}
	
	function openRejectDetail()
	{
		countRD += 1;
		if(countRD%2==0){// open 
			$('#openRD').html("Open Reject Detail");
			isDisplayRD = 0 ; 
		}else{// close
			$('#openRD').html("Close Reject Detail");
			isDisplayRD = 1 ; 
		}
		showHideDetail();
	}
	
	function showHideDetail()
	{
		// alert((isDisplayES + isDisplayIS + isDisplaySD + isDisplayRD));
		if((isDisplayES + isDisplayIS + isDisplaySD + isDisplayRD)==0){
			// hide element
			$('div#shiftlyReportDetail').hide();
		}else{
			// show element
			$('div#shiftlyReportDetail').show();
		}
	}
	
</script>
<p><div class='titlenoline'> Detail Production <div id="judulnya"></div></div></p>
<form id="shiftlyParams">
	<table style="width:500px;">
		<tr valign="top">
			<td colspan="4"> 
		        <div id="divShiftlyDetail">
					<?php echo form_fieldset('&nbsp;&nbsp;&nbsp;Historical&nbsp;&nbsp;&nbsp;'); ?>
					<table>
						<tr valign="top">
							<td nowrap=""> Date From </td>
		                    <td> : </td>
		                    <td><input type="Text" name="tanggal1" id="tanggal1" maxlength="25" style="width: 10em;" readonly="readonly" value="<?php echo date('Y-m-d'); ?>" /></td>
		                    <td><a href="javascript:NewCssCal('tanggal1','yyyymmdd','arrow',false,24,false,'past')" class="buttonnondecore">&nbsp;<img src="<?php echo base_url();?>asset/images/calendar.gif" width="16" height="18" alt="Pick a date"></a></td>
		                    <td width="30">&nbsp;</td>
						</tr>
						<tr>
							<td nowrap=""> Machine Type </td>
					        <td> : </td>
					        <td colspan="3">
						        <select id="typeMachine" name="typeMachine" style="width: 10em">
							        <?php 
										
										$arr_un1 = array("MKR","PKR","CEL","CAR");
							            $arr_un2 = array("Maker","Packer","Cellophaner","Cartoner");
							            for($i=0;$i<=3;$i++)
										{
											if(isset($flag))
							                {
												if($arr_un1[$i]==$unit)
							                    {
													echo "<option value=".$arr_un1[$i]." selected='1'>".$arr_un2[$i]."</option>";
							                    }
							                }
							                else
							                {
												echo "<option value=".$arr_un1[$i].">".$arr_un2[$i]."</option>";
							                }                
							            } 
										
							        ?>
						        </select>
							</td>
							<td width="30">&nbsp;</td>
						</tr>
					    <tr>
							<td nowrap=""> Machine Line </td>
							<td> : </td>
					        <td colspan="3">
							<?php 					
								if(isset($flag))
					            {
									echo $this->fungsi->build_select_common('cmbSectionMachine',$machine,'Sections','Sections','style="width: 10em;"',$line);
								}
								else
					            {
									echo $this->fungsi->build_select_common('cmbSectionMachine',$machine,'Sections','Sections','style="width: 10em;"','');
								}			
					        ?>
							</td>
					        <td width="30">&nbsp;</td>
						</tr>
						<tr>
					        <td> Shift </td>
					        <td> : </td>
					        <td colspan="3"><select id="shift" style="width: 10em;">
					        <option value="1"> Shift 1 </option>
					        <option value="2"> Shift 2 </option>
					        <option value="3"> Shift 3 </option>
					        <option value="l1"> Long Shift 1 </option>
					        <option value="l2"> Long Shift 2 </option>
					        </select></td>
					    </tr>
					</table>
		            <?php echo form_fieldset_close(); ?>
				</div>
	        </td>
	    	<td>
				<table id="tShowStopDetail">
					<tr>
						<td colspan="4"> SHOW TOP DETAIL </td>
					</tr>
					<tr>
						<td nowrap="nowrap"><a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='openExternalStop()' id="openES">Open External Stop</a></td>
						<td nowrap="nowrap"><a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='openInternalStop()' id="openIS">Open Internal Stop</a></td>
						<td nowrap="nowrap"><a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='openStopDetail()' id="openSD">Open Stop Detail</a></td>
						<td nowrap="nowrap"><a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='openRejectDetail()' id="openRD">Open Reject Detail</a></td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td colspan="5">
				<a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='viewShiftlyReport()'>View</a>
				<a class='button buttonblue smallbtn' href='javascript:void(0)' onclick='downloadShiftlyReport()'>Download</a>
			</td>
		</tr>
	</table>
</form>

<div id="output">
	<div id="shiftlyReportTop3">
		shiftly report top 3
	</div>
	<div id="shiftlyReportDetail">
		<p id="externalStopDetail">
			<!-- EXTERNAL STOP DETAIL -->
			external stop detail			
		</p>
		<p id="internalStopDetail">
			<!-- INTERNAL STOP DETAIL -->			
			internal stop detail
		</p>
		<p id="stopDetail">
			<!-- STOP DETAIL -->			
			stop detail 
		</p>
		<p id="rejectDetail">
			<!-- REJECT DETAIL -->						
			reject detail
		</p>
	</div>		
</div>