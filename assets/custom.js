
let selectedVariantId=null;
document.addEventListener('DOMContentLoaded',()=>{
  const selectedVariantScript=document.querySelector('variant-selects [data-selected-variant]');
  if(selectedVariantScript){
    try{
      const variantData=JSON.parse(selectedVariantScript.textContent);
      selectedVariantId=variantData.id;
      console.log(selectedVariantId);
    }
    catch(e){
      console.error("Variant error",e);
    }
  }
 
});
 
subscribe(PUB_SUB_EVENTS.variantChange,({ data })=>{
  selectedVariantId=data.variant?.id||null;
  console.log(selectedVariantId);
})
 
 
document.addEventListener('click',async(e)=>{
const button=e.target.closest('#ajax-custom-add');
console.log("hihi");
  if(!button){
    return;
  }
 
  if(!selectedVariantId){
    console.log("No variant selected");
    return;
  }
 
  const quantityInput=document.querySelector('input[name="quantity"]');
  const quantity=quantityInput?parseInt(quantityInput.value,10):1;
 
  console.log("ADDED to cart : ",{
    variant:selectedVariantId,
    quantity
  });
 
  try {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedVariantId,
        quantity
      })
    });
 
  fetch(`${routes.cart_url}?sections=cart-drawer`)
  .then((response)=>response.json())
  .then((sections)=>{
    const sectionIds=['cart-drawer'];
    for (const sectionId of sectionIds){
      const htmlString=sections[sectionId];
      const html=new DOMParser().parseFromString(htmlString,'text/html');
      const sourceElement=html.querySelector(`${sectionId}`);
      const targetElement=document.querySelector(`${sectionId}`);
      if(targetElement && sourceElement){
        targetElement.replaceWith(sourceElement);
      }
    }
    document.body.classList.add('overflow-hidden');
    const theme_cart=document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    if(theme_cart && theme_cart.classList.contains('is-empty')){
      theme_cart.classList.remove('is-empty');
    }
    theme_cart.classList.add('active');
   
  })
 
  const cartData=await fetch('/cart.js').then(r=>r.json());
 
  const bubble = document.querySelector('.cart-count-bubble span[aria-hidden]');
  if (bubble) {
    bubble.textContent = cartData.item_count;
  }
  const bubbleWrapper = document.querySelector('.cart-count-bubble');
  if (bubbleWrapper) {
    bubbleWrapper.style.display = cart.item_count > 0 ? 'flex' : 'none';
  }
 
  }
  catch (e) {
    console.error('Cart error:', e);
  }
});