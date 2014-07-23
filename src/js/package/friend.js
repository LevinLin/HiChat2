define(function(require, exports, module) {
	var $ = require("jquery");
	var Event = require("event");
	var model = require("mods/model");
	var User = require("mods/user");
	module.exports = {
		list: function() {
			var aIQ = new JSJaCIQ(),
				queryNode = aIQ.setQuery(NS_ROSTER);
			aIQ.setType("get");
			return aIQ;
		},
		parseFriendList: function(friendList) {
			var friends = [];
			$("item", friendList.getQuery()).each(function() {
				var self = $(this);
				var user = new User(self.attr("jid"));
				friends.push(user);
			});
			return friends;
		},
		"parsePresence": function(aPresence) {
			var type = aPresence.getType() || "available";
			var user = new User(aPresence.getFrom());
			var result = {
				type: type,
				user: user
			};
			if (type === "unavailable" || type === "available") {
				result.show = aPresence.getShow();
				result.status = aPresence.getStatus();
			}
			return result;
		},
		"getFriendPresence": function(to) {
			var aPresence = new JSJaCPresence();
			if (to) {
				aPresence.setTo(to.toString());
			}
			return aPresence;
		},
		"sendSubscribe": function(user) {
			var aPresence = new JSJaCPresence();
			aPresence.setTo(user.toString());
			aPresence.setType("subscribe");
			return aPresence;
		},
		"sendUnsubscribe": function(user) {
			var aPresence = new JSJaCPresence();
			aPresence.setTo(user.toString());
			aPresence.setType("unsubscribe");
			return aPresence;
		},
		"sendUnsubscribed": function(user) {
			var aPresence = new JSJaCPresence();
			aPresence.setTo(user.toString());
			aPresence.setType("unsubscribed");
			return aPresence;
		},
		"sendSubscribed": function(user) {
			var aPresence = new JSJaCPresence();
			aPresence.setTo(user.toString());
			aPresence.setType("subscribed");
			return aPresence;
		},
		"sendBothSubscribe": function(user) {
			var aIQ = new JSJaCIQ(),
				queryNode = aIQ.setQuery(NS_ROSTER),
				itemNode = aIQ.buildNode("item");
			aIQ.setType("set");
			itemNode.setAttribute("jid", user.toString());
			itemNode.setAttribute("subscription", "both");
			if (typeof tag === 'string') {
				itemNode.setAttribute("name", tag);
			}
			queryNode.appendChild(itemNode);
			return aIQ;
		},
		"sendRemoveSubscribe": function(user) {
			var aIQ = new JSJaCIQ(),
				queryNode,
				itemNode;
			aIQ.setType("set");
			queryNode = aIQ.setQuery(NS_ROSTER);
			itemNode = aIQ.buildNode("item");
			itemNode.setAttribute("jid", user.toString());
			itemNode.setAttribute("subscription", "remove");
			queryNode.appendChild(itemNode);
			return aIQ;
		}
	};
});